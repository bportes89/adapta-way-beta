import { Asset } from './asset.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
export declare class AssetToken {
    id: string;
    amount: number;
    asset: Asset;
    wallet: Wallet;
}
