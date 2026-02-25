import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WithdrawalRequest } from './entities/withdrawal-request.entity';
import { User } from '../users/entities/user.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
export declare class WalletService {
    private walletRepository;
    private transactionRepository;
    private withdrawalRequestRepository;
    private userRepository;
    private dataSource;
    private blockchainService;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<Transaction>, withdrawalRequestRepository: Repository<WithdrawalRequest>, userRepository: Repository<User>, dataSource: DataSource, blockchainService: BlockchainService);
    getBalance(userId: string): Promise<{
        balance: number;
        adaptaCoinBalance: number;
        address: string;
    }>;
    convert(userId: string, amount: number, fromCurrency: 'BRL' | 'ADAPTA'): Promise<{
        message: string;
        newBalance: number;
        newAdaptaCoinBalance: number;
    }>;
    deposit(userId: string, amount: number): Promise<{
        newBalance: number;
    }>;
    transfer(fromUserId: string, recipient: string, amount: number, currency?: 'BRL' | 'ADAPTA'): Promise<{
        message: string;
    }>;
    withdraw(userId: string, amount: number): Promise<{
        message: string;
        taxDeducted: number;
    }>;
    requestWithdrawal(userId: string, amount: number, pixKey: string): Promise<WithdrawalRequest>;
    getPendingWithdrawals(): Promise<WithdrawalRequest[]>;
    getUserWithdrawals(userId: string): Promise<WithdrawalRequest[]>;
    approveWithdrawal(requestId: string): Promise<WithdrawalRequest>;
    rejectWithdrawal(requestId: string): Promise<WithdrawalRequest>;
    getHistory(userId: string): Promise<Transaction[]>;
    mint(userId: string, amount: number): Promise<{
        newAdaptaCoinBalance: number;
    }>;
    burn(userId: string, amount: number): Promise<{
        newAdaptaCoinBalance: number;
    }>;
}
