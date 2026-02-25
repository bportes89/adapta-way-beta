import { WalletService } from './wallet.service';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getBalance(req: any): Promise<{
        balance: number;
        adaptaCoinBalance: number;
        address: string;
    }>;
    deposit(req: any, body: {
        amount: number;
    }): Promise<{
        newBalance: number;
    }>;
    convert(req: any, body: {
        amount: number;
        fromCurrency: 'BRL' | 'ADAPTA';
    }): Promise<{
        message: string;
        newBalance: number;
        newAdaptaCoinBalance: number;
    }>;
    transfer(req: any, body: {
        recipient: string;
        amount: number;
        currency?: 'BRL' | 'ADAPTA';
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
    mint(body: {
        userId: string;
        amount: number;
    }): Promise<{
        newAdaptaCoinBalance: number;
    }>;
    burn(body: {
        userId: string;
        amount: number;
    }): Promise<{
        newAdaptaCoinBalance: number;
    }>;
    getHistory(req: any): Promise<import("./entities/transaction.entity").Transaction[]>;
}
