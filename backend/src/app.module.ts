import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { AssetsModule } from './assets/assets.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Asset } from './assets/entities/asset.entity';
import { Block } from './blockchain/entities/blockchain.entity';
import { NftsModule } from './nfts/nfts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE') || 'sqlite';
        
        if (dbType === 'mysql' || dbType === 'mariadb') {
          return {
            type: dbType as any,
            host: configService.get<string>('DB_HOST') || 'localhost',
            port: configService.get<number>('DB_PORT') || 3306,
            username: configService.get<string>('DB_USERNAME') || 'root',
            password: configService.get<string>('DB_PASSWORD') || '',
            database: configService.get<string>('DB_DATABASE') || 'adapta_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Em produção, mude para false e use migrations
          };
        }

        // Fallback to SQLite
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    WalletModule,
    AssetsModule,
    BlockchainModule,
    AuthModule,
    NftsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
