import { AssetToken } from './asset-token.entity';
export declare enum AssetType {
    COMPANY = "COMPANY",
    PROJECT = "PROJECT",
    PATENT = "PATENT",
    RIGHTS = "RIGHTS"
}
export declare class Asset {
    id: string;
    name: string;
    description: string;
    type: AssetType;
    totalSupply: number;
    availableSupply: number;
    referenceValue: number;
    tokens: AssetToken[];
}
