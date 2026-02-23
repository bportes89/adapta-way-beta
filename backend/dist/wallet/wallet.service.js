"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const withdrawal_request_entity_1 = require("./entities/withdrawal-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const crypto = __importStar(require("crypto"));
let WalletService = class WalletService {
    walletRepository;
    transactionRepository;
    withdrawalRequestRepository;
    userRepository;
    dataSource;
    blockchainService;
    constructor(walletRepository, transactionRepository, withdrawalRequestRepository, userRepository, dataSource, blockchainService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.withdrawalRequestRepository = withdrawalRequestRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.blockchainService = blockchainService;
    }
    async getBalance(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['wallet'],
        });
        if (!user || !user.wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        if (!user.wallet.address) {
            user.wallet.address = '0x' + crypto.randomBytes(20).toString('hex');
            await this.walletRepository.save(user.wallet);
        }
        return {
            balance: user.wallet.balance,
            address: user.wallet.address,
        };
    }
    async deposit(userId, amount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['wallet'],
            });
            if (!user || !user.wallet) {
                throw new common_1.NotFoundException('Wallet not found');
            }
            user.wallet.balance = Number(user.wallet.balance) + Number(amount);
            await queryRunner.manager.save(user.wallet);
            const transaction = new transaction_entity_1.Transaction();
            transaction.amount = amount;
            transaction.type = transaction_entity_1.TransactionType.DEPOSIT;
            transaction.toWallet = user.wallet;
            transaction.timestamp = new Date();
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'DEPOSIT',
                walletId: user.wallet.id,
                amount: amount,
                timestamp: new Date().toISOString(),
            });
            return { newBalance: user.wallet.balance };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async transfer(fromUserId, recipient, amount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const fromUser = await this.userRepository.findOne({
                where: { id: fromUserId },
                relations: ['wallet'],
            });
            let toUser = await this.userRepository.findOne({
                where: { email: recipient },
                relations: ['wallet'],
            });
            if (!toUser) {
                const wallet = await this.walletRepository.findOne({
                    where: { address: recipient },
                    relations: ['user'],
                });
                if (wallet && wallet.user) {
                    toUser = await this.userRepository.findOne({
                        where: { id: wallet.user.id },
                        relations: ['wallet'],
                    });
                }
            }
            if (!fromUser || !fromUser.wallet)
                throw new common_1.NotFoundException('Sender wallet not found');
            if (!toUser || !toUser.wallet)
                throw new common_1.NotFoundException('Recipient not found');
            if (fromUser.wallet.balance < amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            fromUser.wallet.balance =
                Number(fromUser.wallet.balance) - Number(amount);
            toUser.wallet.balance = Number(toUser.wallet.balance) + Number(amount);
            await queryRunner.manager.save(fromUser.wallet);
            await queryRunner.manager.save(toUser.wallet);
            const transaction = new transaction_entity_1.Transaction();
            transaction.amount = amount;
            transaction.type = transaction_entity_1.TransactionType.TRANSFER;
            transaction.fromWallet = fromUser.wallet;
            transaction.toWallet = toUser.wallet;
            transaction.timestamp = new Date();
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'TRANSFER',
                fromWalletId: fromUser.wallet.id,
                toWalletId: toUser.wallet.id,
                amount: amount,
                timestamp: new Date().toISOString(),
            });
            return { message: 'Transfer successful' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async withdraw(userId, amount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['wallet'],
            });
            if (!user || !user.wallet) {
                throw new common_1.NotFoundException('Wallet not found');
            }
            if (user.wallet.balance < amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            const tax = amount * 0.01;
            const totalDeduction = Number(amount) + Number(tax);
            if (user.wallet.balance < totalDeduction) {
                throw new common_1.BadRequestException('Insufficient balance to cover withdrawal + tax');
            }
            user.wallet.balance =
                Number(user.wallet.balance) - Number(totalDeduction);
            await queryRunner.manager.save(user.wallet);
            const transaction = new transaction_entity_1.Transaction();
            transaction.amount = amount;
            transaction.type = transaction_entity_1.TransactionType.WITHDRAW;
            transaction.fromWallet = user.wallet;
            transaction.timestamp = new Date();
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'WITHDRAW_IMMEDIATE',
                walletId: user.wallet.id,
                amount: amount,
                tax: tax,
                timestamp: new Date().toISOString(),
            });
            return { message: 'Withdrawal successful', taxDeducted: tax };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async requestWithdrawal(userId, amount, pixKey) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['wallet'],
            });
            if (!user || !user.wallet) {
                throw new common_1.NotFoundException('Wallet not found');
            }
            const tax = Number(amount) * 0.01;
            const totalDeduction = Number(amount) + tax;
            if (Number(user.wallet.balance) < totalDeduction) {
                throw new common_1.BadRequestException('Insufficient balance to cover withdrawal + tax');
            }
            user.wallet.balance = Number(user.wallet.balance) - totalDeduction;
            await queryRunner.manager.save(user.wallet);
            const request = new withdrawal_request_entity_1.WithdrawalRequest();
            request.amount = amount;
            request.pixKey = pixKey;
            request.status = withdrawal_request_entity_1.WithdrawalStatus.PENDING;
            request.user = user;
            await queryRunner.manager.save(request);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'WITHDRAW_REQUEST',
                requestId: request.id,
                walletId: user.wallet.id,
                amount: amount,
                timestamp: new Date().toISOString(),
            });
            return request;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getPendingWithdrawals() {
        return this.withdrawalRequestRepository.find({
            where: { status: withdrawal_request_entity_1.WithdrawalStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async getUserWithdrawals(userId) {
        return this.withdrawalRequestRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async approveWithdrawal(requestId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const request = await this.withdrawalRequestRepository.findOne({
                where: { id: requestId },
                relations: ['user', 'user.wallet'],
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status !== withdrawal_request_entity_1.WithdrawalStatus.PENDING) {
                throw new common_1.BadRequestException('Request already processed');
            }
            request.status = withdrawal_request_entity_1.WithdrawalStatus.APPROVED;
            request.processedAt = new Date();
            await queryRunner.manager.save(request);
            const transaction = new transaction_entity_1.Transaction();
            transaction.amount = request.amount;
            transaction.type = transaction_entity_1.TransactionType.WITHDRAW;
            transaction.fromWallet = request.user.wallet;
            transaction.timestamp = new Date();
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'WITHDRAW_APPROVED',
                requestId: request.id,
                walletId: request.user.wallet.id,
                amount: request.amount,
                timestamp: new Date().toISOString(),
            });
            return request;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async rejectWithdrawal(requestId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const request = await this.withdrawalRequestRepository.findOne({
                where: { id: requestId },
                relations: ['user', 'user.wallet'],
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status !== withdrawal_request_entity_1.WithdrawalStatus.PENDING) {
                throw new common_1.BadRequestException('Request already processed');
            }
            const tax = Number(request.amount) * 0.01;
            const totalRefund = Number(request.amount) + tax;
            request.user.wallet.balance =
                Number(request.user.wallet.balance) + totalRefund;
            await queryRunner.manager.save(request.user.wallet);
            request.status = withdrawal_request_entity_1.WithdrawalStatus.REJECTED;
            request.processedAt = new Date();
            await queryRunner.manager.save(request);
            await queryRunner.commitTransaction();
            this.blockchainService.createBlock({
                type: 'WITHDRAW_REJECTED',
                requestId: request.id,
                walletId: request.user.wallet.id,
                amount: request.amount,
                timestamp: new Date().toISOString(),
            });
            return request;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getHistory(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['wallet'],
        });
        if (!user || !user.wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const transactions = await this.transactionRepository.find({
            where: [
                { fromWallet: { id: user.wallet.id } },
                { toWallet: { id: user.wallet.id } },
            ],
            order: { timestamp: 'DESC' },
            relations: ['fromWallet', 'toWallet'],
        });
        return transactions;
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(withdrawal_request_entity_1.WithdrawalRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        blockchain_service_1.BlockchainService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map