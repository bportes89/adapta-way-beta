import { User } from '../../users/entities/user.entity';
import { Transaction } from './transaction.entity';
export declare class Wallet {
    id: string;
    address: string;
    balance: number;
    user: User;
    transactionsSent: Transaction[];
    transactionsReceived: Transaction[];
}
