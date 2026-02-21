import { AssetType } from '../entities/asset.entity';
export declare class CreateAssetDto {
    name: string;
    description: string;
    type: AssetType;
    totalSupply: number;
    referenceValue: number;
}
