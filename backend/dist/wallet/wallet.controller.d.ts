import { WalletService } from './wallet.service';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getBalance(req: any): Promise<{
        balance: number;
        address: string;
    }>;
    deposit(req: any, body: {
        amount: number;
    }): Promise<{
        newBalance: number;
    }>;
    transfer(req: any, body: {
        recipient: string;
        amount: number;
    }): Promise<{
        message: string;
    }>;
    withdraw(req: any, body: {
        amount: number;
    }): Promise<{
        message: string;
        taxDeducted: number;
    }>;
    requestWithdrawal(req: any, body: RequestWithdrawalDto): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest>;
    getUserWithdrawals(req: any): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest[]>;
    getPendingWithdrawals(): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest[]>;
    approveWithdrawal(id: string): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest>;
    rejectWithdrawal(id: string): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest>;
    getHistory(req: any): Promise<import("./entities/transaction.entity").Transaction[]>;
}
