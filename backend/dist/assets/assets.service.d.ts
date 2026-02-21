import { Repository, DataSource } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { AssetToken } from './entities/asset-token.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
export declare class AssetsService {
    private assetRepository;
    private assetTokenRepository;
    private dataSource;
    private blockchainService;
    constructor(assetRepository: Repository<Asset>, assetTokenRepository: Repository<AssetToken>, dataSource: DataSource, blockchainService: BlockchainService);
    create(createAssetDto: CreateAssetDto): Promise<Asset>;
    findAll(): Promise<Asset[]>;
    findOne(id: string): Promise<Asset | null>;
    getMyAssets(userId: string): Promise<AssetToken[]>;
    buyAsset(userId: string, assetId: string, amount: number): Promise<{
        message: string;
        assetToken: AssetToken;
    }>;
}
