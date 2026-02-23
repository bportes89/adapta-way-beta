import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('2fa/authenticate')
  async authenticate(@Body() body: any) {
    return this.authService.loginWith2fa(body.user, body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generate2fa(@Request() req: any) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(req.user);
    return this.authService.generateQrCodeDataURL(otpauthUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turnOn2fa(@Request() req: any, @Body() body: any) {
    const isCodeValid = await this.authService.loginWith2fa(
      req.user,
      body.token,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
