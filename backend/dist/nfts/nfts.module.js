"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nfts_service_1 = require("./nfts.service");
const nfts_controller_1 = require("./nfts.controller");
const nft_entity_1 = require("./entities/nft.entity");
const blockchain_module_1 = require("../blockchain/blockchain.module");
const wallet_module_1 = require("../wallet/wallet.module");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
let NftsModule = class NftsModule {
};
exports.NftsModule = NftsModule;
exports.NftsModule = NftsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([nft_entity_1.Nft, wallet_entity_1.Wallet]),
            blockchain_module_1.BlockchainModule,
            wallet_module_1.WalletModule,
        ],
        controllers: [nfts_controller_1.NftsController],
        providers: [nfts_service_1.NftsService],
    })
], NftsModule);
//# sourceMappingURL=nfts.module.js.map