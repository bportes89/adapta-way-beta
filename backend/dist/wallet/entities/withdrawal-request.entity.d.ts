import { User } from '../../users/entities/user.entity';
export declare enum WithdrawalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class WithdrawalRequest {
    id: string;
    amount: number;
    pixKey: string;
    status: WithdrawalStatus;
    user: User;
    createdAt: Date;
    processedAt: Date;
}
