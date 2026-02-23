import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// @ts-ignore
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (user.status !== 'active') {
        return null; // Or throw specific exception if strategy allows
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (user.isTwoFactorAuthenticationEnabled) {
      return {
        isTwoFactorAuthenticationEnabled: true,
        user: { email: user.email, id: user.id, role: user.role },
      };
    }
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      isTwoFactorAuthenticated: true,
    };
    return {
      access_token: this.jwtService.sign(payload),
      isTwoFactorAuthenticationEnabled: false,
    };
  }

  async loginWith2fa(userWithoutPsw: any, token: string) {
    const user = await this.usersService.findByEmail(userWithoutPsw.email);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const isCodeValid = authenticator.verify({
      token: token,
      secret: user.twoFactorAuthenticationSecret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      isTwoFactorAuthenticated: true,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTwoFactorAuthenticationSecret(user: any) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'AdaptaWay', secret);

    await this.usersService.setTwoFactorAuthenticationSecret(
      secret,
      user.userId,
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return this.usersService.turnOnTwoFactorAuthentication(userId);
  }
}
