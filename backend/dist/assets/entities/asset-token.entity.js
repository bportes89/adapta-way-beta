"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetToken = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
const wallet_entity_1 = require("../../wallet/entities/wallet.entity");
let AssetToken = class AssetToken {
    id;
    amount;
    asset;
    wallet;
};
exports.AssetToken = AssetToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], AssetToken.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_entity_1.Asset, (asset) => asset.tokens),
    __metadata("design:type", asset_entity_1.Asset)
], AssetToken.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    __metadata("design:type", wallet_entity_1.Wallet)
], AssetToken.prototype, "wallet", void 0);
exports.AssetToken = AssetToken = __decorate([
    (0, typeorm_1.Entity)()
], AssetToken);
//# sourceMappingURL=asset-token.entity.js.map