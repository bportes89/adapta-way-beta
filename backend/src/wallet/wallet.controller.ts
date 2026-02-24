import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@ApiTags('wallet')
@ApiBearerAuth()
@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getBalance(@Request() req: any) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit funds (mock)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { amount: { type: 'number', example: 100 } },
    },
  })
  deposit(@Request() req: any, @Body() body: { amount: number }) {
    return this.walletService.deposit(req.user.userId, body.amount);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert between BRL and AdaptaCoin' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 100 },
        fromCurrency: { type: 'string', enum: ['BRL', 'ADAPTA'], example: 'BRL' },
      },
    },
  })
  convert(
    @Request() req: any,
    @Body() body: { amount: number; fromCurrency: 'BRL' | 'ADAPTA' },
  ) {
    return this.walletService.convert(
      req.user.userId,
      body.amount,
      body.fromCurrency,
    );
  }

  @Post('transfer')
  @ApiOperation({
    summary: 'Transfer funds to another user (Email or Wallet Address)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recipient: { type: 'string', example: 'receiver@example.com or 0x...' },
        amount: { type: 'number', example: 50 },
        currency: { type: 'string', enum: ['BRL', 'ADAPTA'], example: 'BRL', default: 'BRL' },
      },
    },
  })
  transfer(
    @Request() req: any,
    @Body() body: { recipient: string; amount: number; currency?: 'BRL' | 'ADAPTA' },
  ) {
    return this.walletService.transfer(
      req.user.userId,
      body.recipient,
      body.amount,
      body.currency || 'BRL',
    );
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Immediate withdrawal (simulated)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { amount: { type: 'number', example: 100 } },
    },
  })
  withdraw(@Request() req: any, @Body() body: { amount: number }) {
    return this.walletService.withdraw(req.user.userId, body.amount);
  }

  @Post('withdraw-request')
  @ApiOperation({ summary: 'Request a withdrawal via PIX' })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal requested successfully.',
  })
  requestWithdrawal(@Request() req: any, @Body() body: RequestWithdrawalDto) {
    return this.walletService.requestWithdrawal(
      req.user.userId,
      body.amount,
      body.pixKey,
    );
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Get user withdrawal history' })
  getUserWithdrawals(@Request() req: any) {
    return this.walletService.getUserWithdrawals(req.user.userId);
  }

  @Get('admin/withdrawals')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all pending withdrawals (Admin only)' })
  getPendingWithdrawals() {
    return this.walletService.getPendingWithdrawals();
  }

  @Post('admin/withdrawals/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Approve a withdrawal request (Admin only)' })
  approveWithdrawal(@Param('id') id: string) {
    return this.walletService.approveWithdrawal(id);
  }

  @Post('admin/withdrawals/:id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Reject a withdrawal request (Admin only)' })
  rejectWithdrawal(@Param('id') id: string) {
    return this.walletService.rejectWithdrawal(id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get transaction history' })
  getHistory(@Request() req: any) {
    return this.walletService.getHistory(req.user.userId);
  }
}
