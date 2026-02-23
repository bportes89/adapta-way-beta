"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("./entities/asset.entity");
const asset_token_entity_1 = require("./entities/asset-token.entity");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const transaction_entity_1 = require("../wallet/entities/transaction.entity");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let AssetsService = class AssetsService {
    assetRepository;
    assetTokenRepository;
    dataSource;
    blockchainService;
    constructor(assetRepository, assetTokenRepository, dataSource, blockchainService) {
        this.assetRepository = assetRepository;
        this.assetTokenRepository = assetTokenRepository;
        this.dataSource = dataSource;
        this.blockchainService = blockchainService;
    }
    async create(createAssetDto) {
        const asset = this.assetRepository.create({
            ...createAssetDto,
            availableSupply: createAssetDto.totalSupply,
        });
        return this.assetRepository.save(asset);
    }
    findAll() {
        return this.assetRepository.find();
    }
    findOne(id) {
        return this.assetRepository.findOne({ where: { id } });
    }
    async getMyAssets(userId) {
        return this.assetTokenRepository.find({
            where: { wallet: { user: { id: userId } } },
            relations: ['asset'],
        });
    }
    async buyAsset(userId, assetId, amount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const asset = await this.assetRepository.findOne({
                where: { id: assetId },
            });
            if (!asset)
                throw new common_1.NotFoundException('Asset not found');
            if (asset.availableSupply < amount) {
                throw new common_1.BadRequestException('Not enough assets available');
            }
            const totalCost = Number(asset.referenceValue) * Number(amount);
            const wallet = await queryRunner.manager.findOne(wallet_entity_1.Wallet, {
                where: { user: { id: userId } },
                relations: ['user'],
            });
            if (!wallet)
                throw new common_1.NotFoundException('Wallet not found');
            if (wallet.balance < totalCost) {
                throw new common_1.BadRequestException('Insufficient balance to buy assets');
            }
            wallet.balance = Number(wallet.balance) - Number(totalCost);
            await queryRunner.manager.save(wallet);
            asset.availableSupply = Number(asset.availableSupply) - Number(amount);
            await queryRunner.manager.save(asset);
            let assetToken = await queryRunner.manager.findOne(asset_token_entity_1.AssetToken, {
                where: { wallet: { id: wallet.id }, asset: { id: asset.id } },
            });
            if (assetToken) {
                assetToken.amount = Number(assetToken.amount) + Number(amount);
                await queryRunner.manager.save(assetToken);
            }
            else {
                assetToken = new asset_token_entity_1.AssetToken();
                assetToken.amount = amount;
                assetToken.asset = asset;
                assetToken.wallet = wallet;
                await queryRunner.manager.save(assetToken);
            }
            const transaction = new transaction_entity_1.Transaction();
            transaction.amount = totalCost;
            transaction.type = transaction_entity_1.TransactionType.BUY_ASSET;
            transaction.fromWallet = wallet;
            transaction.timestamp = new Date();
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'BUY_ASSET',
                walletId: wallet.id,
                assetId: asset.id,
                amount: amount,
                totalCost: totalCost,
                timestamp: new Date().toISOString(),
            });
            return { message: 'Asset purchased successfully', assetToken };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __param(1, (0, typeorm_1.InjectRepository)(asset_token_entity_1.AssetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        blockchain_service_1.BlockchainService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map