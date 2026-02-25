import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    TRANSFER = "TRANSFER",
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    MINT = "MINT",
    BURN = "BURN",
    BUY_ASSET = "BUY_ASSET",
    CONVERSION = "CONVERSION"
}
export declare class Transaction {
    id: string;
    amount: number;
    currency: string;
    type: TransactionType;
    fromWallet: Wallet;
    toWallet: Wallet;
    timestamp: Date;
    hash: string;
}
