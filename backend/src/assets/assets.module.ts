import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset } from './entities/asset.entity';
import { AssetToken } from './entities/asset-token.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetToken]), BlockchainModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
