import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    TRANSFER = "TRANSFER",
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    MINT = "MINT",
    BURN = "BURN",
    BUY_ASSET = "BUY_ASSET"
}
export declare class Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    fromWallet: Wallet;
    toWallet: Wallet;
    timestamp: Date;
    hash: string;
}
