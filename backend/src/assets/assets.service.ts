import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { AssetToken } from './entities/asset-token.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import {
  Transaction,
  TransactionType,
} from '../wallet/entities/transaction.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(AssetToken)
    private assetTokenRepository: Repository<AssetToken>,
    private dataSource: DataSource,
    private blockchainService: BlockchainService,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const asset = this.assetRepository.create({
      ...createAssetDto,
      availableSupply: createAssetDto.totalSupply,
    });
    const savedAsset = await this.assetRepository.save(asset);

    // Blockchain Record
    await this.blockchainService.createBlock({
      type: 'ASSET_CREATION',
      assetId: savedAsset.id,
      name: savedAsset.name,
      totalSupply: savedAsset.totalSupply,
      referenceValue: savedAsset.referenceValue,
      timestamp: new Date().toISOString(),
    });

    return savedAsset;
  }

  findAll() {
    return this.assetRepository.find();
  }

  findOne(id: string) {
    return this.assetRepository.findOne({ where: { id } });
  }

  async getMyAssets(userId: string) {
    return this.assetTokenRepository.find({
      where: { wallet: { user: { id: userId } } },
      relations: ['asset'],
    });
  }

  async buyAsset(userId: string, assetId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const asset = await this.assetRepository.findOne({
        where: { id: assetId },
      });
      if (!asset) throw new NotFoundException('Asset not found');

      if (asset.availableSupply < amount) {
        throw new BadRequestException('Not enough assets available');
      }

      const totalCost = Number(asset.referenceValue) * Number(amount);

      // We need to fetch the user wallet with the transaction manager to lock it potentially,
      // but for now let's just use a query
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!wallet) throw new NotFoundException('Wallet not found');

      if (Number(wallet.adaptaCoinBalance) < totalCost) {
        throw new BadRequestException('Insufficient AdaptaCoin balance to buy assets');
      }

      // Deduct balance
      wallet.adaptaCoinBalance = Number(wallet.adaptaCoinBalance) - Number(totalCost);
      await queryRunner.manager.save(wallet);

      // Update asset supply
      asset.availableSupply = Number(asset.availableSupply) - Number(amount);
      await queryRunner.manager.save(asset);

      // Create Asset Token Record
      // Check if user already owns this asset token
      let assetToken = await queryRunner.manager.findOne(AssetToken, {
        where: { wallet: { id: wallet.id }, asset: { id: asset.id } },
      });

      if (assetToken) {
        assetToken.amount = Number(assetToken.amount) + Number(amount);
        await queryRunner.manager.save(assetToken);
      } else {
        assetToken = new AssetToken();
        assetToken.amount = amount;
        assetToken.asset = asset;
        assetToken.wallet = wallet;
        await queryRunner.manager.save(assetToken);
      }

      // Record Transaction
      const transaction = new Transaction();
      transaction.amount = totalCost;
      transaction.currency = 'ADAPTA';
      transaction.type = TransactionType.BUY_ASSET;
      transaction.fromWallet = wallet;
      transaction.timestamp = new Date();
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Blockchain Record
      await this.blockchainService.createBlock({
        type: 'BUY_ASSET',
        walletId: wallet.id,
        assetId: asset.id,
        amount: amount,
        totalCost: totalCost,
        currency: 'ADAPTA',
        timestamp: new Date().toISOString(),
      });

      return { message: 'Asset purchased successfully', assetToken };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
