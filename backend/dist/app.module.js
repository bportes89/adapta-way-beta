"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const wallet_module_1 = require("./wallet/wallet.module");
const assets_module_1 = require("./assets/assets.module");
const blockchain_module_1 = require("./blockchain/blockchain.module");
const auth_module_1 = require("./auth/auth.module");
const nfts_module_1 = require("./nfts/nfts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbType = configService.get('DB_TYPE') || 'sqlite';
                    if (dbType === 'mysql' || dbType === 'mariadb') {
                        return {
                            type: dbType,
                            host: configService.get('DB_HOST') || 'localhost',
                            port: configService.get('DB_PORT') || 3306,
                            username: configService.get('DB_USERNAME') || 'root',
                            password: configService.get('DB_PASSWORD') || '',
                            database: configService.get('DB_DATABASE') || 'adapta_db',
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'sqlite',
                        database: 'database.sqlite',
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: true,
                    };
                },
            }),
            users_module_1.UsersModule,
            wallet_module_1.WalletModule,
            assets_module_1.AssetsModule,
            blockchain_module_1.BlockchainModule,
            auth_module_1.AuthModule,
            nfts_module_1.NftsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map