import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { WithdrawalRequest, WithdrawalStatus } from './entities/withdrawal-request.entity';
import { User } from '../users/entities/user.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(WithdrawalRequest)
    private withdrawalRequestRepository: Repository<WithdrawalRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private blockchainService: BlockchainService,
  ) {}

  async getBalance(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    if (!user || !user.wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (!user.wallet.address) {
      user.wallet.address = '0x' + crypto.randomBytes(20).toString('hex');
      await this.walletRepository.save(user.wallet);
    }

    return { 
      balance: user.wallet.balance,
      address: user.wallet.address 
    };
  }

  async deposit(userId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!user || !user.wallet) {
        throw new NotFoundException('Wallet not found');
      }

      user.wallet.balance = Number(user.wallet.balance) + Number(amount);
      await queryRunner.manager.save(user.wallet);

      const transaction = new Transaction();
      transaction.amount = amount;
      transaction.type = TransactionType.DEPOSIT;
      transaction.toWallet = user.wallet;
      transaction.timestamp = new Date();
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'DEPOSIT',
        walletId: user.wallet.id,
        amount: amount,
        timestamp: new Date().toISOString(),
      });

      return { newBalance: user.wallet.balance };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(fromUserId: string, recipient: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromUser = await this.userRepository.findOne({
        where: { id: fromUserId },
        relations: ['wallet'],
      });

      // Try to find recipient by Email
      let toUser = await this.userRepository.findOne({
        where: { email: recipient },
        relations: ['wallet'],
      });

      // If not found by email, try to find by Wallet Address
      if (!toUser) {
        const wallet = await this.walletRepository.findOne({
            where: { address: recipient },
            relations: ['user']
        });
        if (wallet && wallet.user) {
            toUser = await this.userRepository.findOne({
                where: { id: wallet.user.id },
                relations: ['wallet']
            });
        }
      }

      if (!fromUser || !fromUser.wallet) throw new NotFoundException('Sender wallet not found');
      if (!toUser || !toUser.wallet) throw new NotFoundException('Recipient not found');

      if (fromUser.wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      fromUser.wallet.balance = Number(fromUser.wallet.balance) - Number(amount);
      toUser.wallet.balance = Number(toUser.wallet.balance) + Number(amount);

      await queryRunner.manager.save(fromUser.wallet);
      await queryRunner.manager.save(toUser.wallet);

      const transaction = new Transaction();
      transaction.amount = amount;
      transaction.type = TransactionType.TRANSFER;
      transaction.fromWallet = fromUser.wallet;
      transaction.toWallet = toUser.wallet;
      transaction.timestamp = new Date();
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'TRANSFER',
        fromWalletId: fromUser.wallet.id,
        toWalletId: toUser.wallet.id,
        amount: amount,
        timestamp: new Date().toISOString(),
      });

      return { message: 'Transfer successful' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(userId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!user || !user.wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (user.wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Taxa de serviço simulada (e.g., 1%)
      const tax = amount * 0.01;
      const totalDeduction = Number(amount) + Number(tax);

      if (user.wallet.balance < totalDeduction) {
        throw new BadRequestException('Insufficient balance to cover withdrawal + tax');
      }

      user.wallet.balance = Number(user.wallet.balance) - Number(totalDeduction);
      await queryRunner.manager.save(user.wallet);

      const transaction = new Transaction();
      transaction.amount = amount; // Valor líquido do saque
      transaction.type = TransactionType.WITHDRAW;
      transaction.fromWallet = user.wallet;
      transaction.timestamp = new Date();
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'WITHDRAW_IMMEDIATE',
        walletId: user.wallet.id,
        amount: amount,
        tax: tax,
        timestamp: new Date().toISOString(),
      });

      return { message: 'Withdrawal successful', taxDeducted: tax };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async requestWithdrawal(userId: string, amount: number, pixKey: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!user || !user.wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const tax = Number(amount) * 0.01;
      const totalDeduction = Number(amount) + tax;

      if (Number(user.wallet.balance) < totalDeduction) {
        throw new BadRequestException('Insufficient balance to cover withdrawal + tax');
      }

      // Deduct immediately to lock funds
      user.wallet.balance = Number(user.wallet.balance) - totalDeduction;
      await queryRunner.manager.save(user.wallet);

      const request = new WithdrawalRequest();
      request.amount = amount;
      request.pixKey = pixKey;
      request.status = WithdrawalStatus.PENDING;
      request.user = user;
      await queryRunner.manager.save(request);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'WITHDRAW_REQUEST',
        requestId: request.id,
        walletId: user.wallet.id,
        amount: amount,
        timestamp: new Date().toISOString(),
      });

      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPendingWithdrawals() {
    return this.withdrawalRequestRepository.find({
      where: { status: WithdrawalStatus.PENDING },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getUserWithdrawals(userId: string) {
    return this.withdrawalRequestRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async approveWithdrawal(requestId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await this.withdrawalRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user', 'user.wallet'],
      });

      if (!request) throw new NotFoundException('Request not found');
      if (request.status !== WithdrawalStatus.PENDING) {
        throw new BadRequestException('Request already processed');
      }

      request.status = WithdrawalStatus.APPROVED;
      request.processedAt = new Date();
      await queryRunner.manager.save(request);

      const transaction = new Transaction();
      transaction.amount = request.amount;
      transaction.type = TransactionType.WITHDRAW;
      transaction.fromWallet = request.user.wallet;
      transaction.timestamp = new Date();
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'WITHDRAW_APPROVED',
        requestId: request.id,
        walletId: request.user.wallet.id,
        amount: request.amount,
        timestamp: new Date().toISOString(),
      });

      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectWithdrawal(requestId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await this.withdrawalRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user', 'user.wallet'],
      });

      if (!request) throw new NotFoundException('Request not found');
      if (request.status !== WithdrawalStatus.PENDING) {
        throw new BadRequestException('Request already processed');
      }

      // Refund the user
      const tax = Number(request.amount) * 0.01;
      const totalRefund = Number(request.amount) + tax;
      
      request.user.wallet.balance = Number(request.user.wallet.balance) + totalRefund;
      await queryRunner.manager.save(request.user.wallet);

      request.status = WithdrawalStatus.REJECTED;
      request.processedAt = new Date();
      await queryRunner.manager.save(request);

      await queryRunner.commitTransaction();

      // Blockchain Record
      this.blockchainService.createBlock({
        type: 'WITHDRAW_REJECTED',
        requestId: request.id,
        walletId: request.user.wallet.id,
        amount: request.amount,
        timestamp: new Date().toISOString(),
      });

      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getHistory(userId: string) {
    const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['wallet'],
    });

    if (!user || !user.wallet) {
        throw new NotFoundException('Wallet not found');
    }

    const transactions = await this.transactionRepository.find({
        where: [
            { fromWallet: { id: user.wallet.id } },
            { toWallet: { id: user.wallet.id } }
        ],
        order: { timestamp: 'DESC' },
        relations: ['fromWallet', 'toWallet']
    });

    return transactions;
  }
}
