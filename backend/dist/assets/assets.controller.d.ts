import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(createAssetDto: CreateAssetDto): Promise<import("./entities/asset.entity").Asset>;
    findAll(): Promise<import("./entities/asset.entity").Asset[]>;
    getMyAssets(req: any): Promise<import("./entities/asset-token.entity").AssetToken[]>;
    findOne(id: string): Promise<import("./entities/asset.entity").Asset | null>;
    buyAsset(id: string, body: {
        amount: number;
    }, req: any): Promise<{
        message: string;
        assetToken: import("./entities/asset-token.entity").AssetToken;
    }>;
}
