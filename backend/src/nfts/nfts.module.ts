import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { Nft } from './entities/nft.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { WalletModule } from '../wallet/wallet.module';
import { Wallet } from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, Wallet]),
    BlockchainModule,
    WalletModule,
  ],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
