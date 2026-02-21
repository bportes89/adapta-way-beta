import { Wallet } from '../../wallet/entities/wallet.entity';
export declare class Nft {
    id: string;
    name: string;
    description: string;
    metadata: any;
    blockchainHash: string;
    owner: Wallet;
    createdAt: Date;
}
