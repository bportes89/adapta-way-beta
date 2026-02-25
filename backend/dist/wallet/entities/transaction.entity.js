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
exports.Transaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["TRANSFER"] = "TRANSFER";
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["MINT"] = "MINT";
    TransactionType["BURN"] = "BURN";
    TransactionType["BUY_ASSET"] = "BUY_ASSET";
    TransactionType["CONVERSION"] = "CONVERSION";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let Transaction = class Transaction {
    id;
    amount;
    currency;
    type;
    fromWallet;
    toWallet;
    timestamp;
    hash;
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'BRL' }),
    __metadata("design:type", String)
], Transaction.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: TransactionType,
        default: TransactionType.TRANSFER,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, { nullable: true }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "fromWallet", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, { nullable: true }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "toWallet", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "hash", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
//# sourceMappingURL=transaction.entity.js.map