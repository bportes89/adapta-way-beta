import { Wallet } from '../../wallet/entities/wallet.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    socialName: string;
    photoUrl: string;
    role: string;
    status: string;
    is2faEnabled: boolean;
    twoFactorAuthenticationSecret?: string;
    wallet: Wallet;
    createdAt: Date;
    updatedAt: Date;
}
