import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(payload: any): Promise<{
        userId: string;
        id: string;
        email: string;
        name: string;
        role: string;
        socialName: string;
        photoUrl: string;
        is2faEnabled: boolean;
    }>;
}
export {};
