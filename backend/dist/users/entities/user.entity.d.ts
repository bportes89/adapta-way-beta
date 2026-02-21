import { Wallet } from '../../wallet/entities/wallet.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    status: string;
    is2faEnabled: boolean;
    twoFactorAuthenticationSecret?: string;
    wallet: Wallet;
}
