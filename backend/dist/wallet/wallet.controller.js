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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const request_withdrawal_dto_1 = require("./dto/request-withdrawal.dto");
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    getBalance(req) {
        return this.walletService.getBalance(req.user.userId);
    }
    deposit(req, body) {
        return this.walletService.deposit(req.user.userId, body.amount);
    }
    convert(req, body) {
        return this.walletService.convert(req.user.userId, body.amount, body.fromCurrency);
    }
    transfer(req, body) {
        return this.walletService.transfer(req.user.userId, body.recipient, body.amount, body.currency || 'BRL');
    }
    withdraw(req, body) {
        return this.walletService.withdraw(req.user.userId, body.amount);
    }
    requestWithdrawal(req, body) {
        return this.walletService.requestWithdrawal(req.user.userId, body.amount, body.pixKey);
    }
    getUserWithdrawals(req) {
        return this.walletService.getUserWithdrawals(req.user.userId);
    }
    getPendingWithdrawals() {
        return this.walletService.getPendingWithdrawals();
    }
    approveWithdrawal(id) {
        return this.walletService.approveWithdrawal(id);
    }
    rejectWithdrawal(id) {
        return this.walletService.rejectWithdrawal(id);
    }
    mint(body) {
        return this.walletService.mint(body.userId, body.amount);
    }
    burn(body) {
        return this.walletService.burn(body.userId, body.amount);
    }
    getHistory(req) {
        return this.walletService.getHistory(req.user.userId);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)('deposit'),
    (0, swagger_1.ApiOperation)({ summary: 'Deposit funds (mock)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { amount: { type: 'number', example: 100 } },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)('convert'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert between BRL and AdaptaCoin' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'number', example: 100 },
                fromCurrency: { type: 'string', enum: ['BRL', 'ADAPTA'], example: 'BRL' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "convert", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Transfer funds to another user (Email or Wallet Address)',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                recipient: { type: 'string', example: 'receiver@example.com or 0x...' },
                amount: { type: 'number', example: 50 },
                currency: { type: 'string', enum: ['BRL', 'ADAPTA'], example: 'BRL', default: 'BRL' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Immediate withdrawal (simulated)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { amount: { type: 'number', example: 100 } },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)('withdraw-request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a withdrawal via PIX' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Withdrawal requested successfully.',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_withdrawal_dto_1.RequestWithdrawalDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "requestWithdrawal", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user withdrawal history' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getUserWithdrawals", null);
__decorate([
    (0, common_1.Get)('admin/withdrawals'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pending withdrawals (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getPendingWithdrawals", null);
__decorate([
    (0, common_1.Post)('admin/withdrawals/:id/approve'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a withdrawal request (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "approveWithdrawal", null);
__decorate([
    (0, common_1.Post)('admin/withdrawals/:id/reject'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a withdrawal request (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "rejectWithdrawal", null);
__decorate([
    (0, common_1.Post)('admin/mint'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Mint AdaptaCoins for a user (Admin only)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                amount: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "mint", null);
__decorate([
    (0, common_1.Post)('admin/burn'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Burn AdaptaCoins from a user (Admin only)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                amount: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "burn", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getHistory", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('wallet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map