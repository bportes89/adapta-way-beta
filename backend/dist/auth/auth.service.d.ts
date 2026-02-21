import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        isTwoFactorAuthenticationEnabled: boolean;
        user: {
            email: any;
            id: any;
            role: any;
        };
        access_token?: undefined;
    } | {
        access_token: string;
        isTwoFactorAuthenticationEnabled: boolean;
        user?: undefined;
    }>;
    loginWith2fa(userWithoutPsw: any, token: string): Promise<{
        access_token: string;
    }>;
    generateTwoFactorAuthenticationSecret(user: any): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<string>;
    turnOnTwoFactorAuthentication(userId: string): Promise<import("typeorm").UpdateResult>;
}
