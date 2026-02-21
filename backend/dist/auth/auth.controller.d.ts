import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
    authenticate(body: any): Promise<{
        access_token: string;
    }>;
    generate2fa(req: any): Promise<string>;
    turnOn2fa(req: any, body: any): Promise<void>;
    getProfile(req: any): any;
}
