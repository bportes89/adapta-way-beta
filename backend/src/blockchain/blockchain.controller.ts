import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getChain() {
    return this.blockchainService.getChain();
  }

  @Post('mine')
  mineBlock(@Body() body: any) {
    return this.blockchainService.createBlock(body);
  }

  @Get('valid')
  isValid() {
    return this.blockchainService.isValidChain();
  }
}
