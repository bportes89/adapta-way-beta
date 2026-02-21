import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Nft } from './entities/nft.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class NftsService {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private blockchainService: BlockchainService,
  ) {}

  async create(createNftDto: CreateNftDto, userId: string) {
    const ownerId = createNftDto.ownerId || userId;
    
    // Find wallet by user ID (assuming relation user -> wallet)
    // Actually wallet.user is the relation.
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: ownerId } },
    });

    if (!wallet) throw new NotFoundException('Wallet not found for this user');

    const nft = this.nftRepository.create({
      ...createNftDto,
      owner: wallet,
      createdAt: new Date(),
    });

    const savedNft = await this.nftRepository.save(nft);

    // Register on Blockchain
    const blockData = {
      type: 'NFT_MINT',
      nftId: savedNft.id,
      ownerId: wallet.id,
      metadata: savedNft.metadata,
    };
    const block = await this.blockchainService.createBlock(blockData);

    savedNft.blockchainHash = block.hash;
    return this.nftRepository.save(savedNft);
  }

  findAll() {
    return this.nftRepository.find({ relations: ['owner', 'owner.user'] });
  }

  async findMyNfts(userId: string) {
    return this.nftRepository.find({
      where: { owner: { user: { id: userId } } },
      relations: ['owner'],
    });
  }

  findOne(id: string) {
    return this.nftRepository.findOne({ 
      where: { id },
      relations: ['owner', 'owner.user']
    });
  }

  update(id: string, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft (Not implemented)`;
  }

  remove(id: string) {
    return this.nftRepository.delete(id);
  }
}
