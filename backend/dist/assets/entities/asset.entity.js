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
exports.Asset = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const asset_token_entity_1 = require("./asset-token.entity");
var AssetType;
(function (AssetType) {
    AssetType["COMPANY"] = "COMPANY";
    AssetType["PROJECT"] = "PROJECT";
    AssetType["PATENT"] = "PATENT";
    AssetType["RIGHTS"] = "RIGHTS";
})(AssetType || (exports.AssetType = AssetType = {}));
let Asset = class Asset {
    id;
    name;
    description;
    type;
    totalSupply;
    availableSupply;
    referenceValue;
    tokens;
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: AssetType,
        default: AssetType.PROJECT
    }),
    __metadata("design:type", String)
], Asset.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Asset.prototype, "totalSupply", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Asset.prototype, "availableSupply", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Asset.prototype, "referenceValue", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_token_entity_1.AssetToken, (token) => token.asset),
    __metadata("design:type", Array)
], Asset.prototype, "tokens", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)()
], Asset);
//# sourceMappingURL=asset.entity.js.map