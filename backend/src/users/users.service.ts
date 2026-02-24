import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Create Wallet
    const wallet = this.walletRepository.create({
      balance: 0,
      address: '0x' + crypto.randomBytes(20).toString('hex'),
    });
    user.wallet = wallet;

    return this.usersRepository.save(user);
  }

  async findAll(options?: any, search?: string) {
    if (!options) return this.usersRepository.find();

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where = search ? [
      { name: Like(`%${search}%`) },
      { email: Like(`%${search}%`) }
    ] : {};

    const [result, total] = await this.usersRepository.findAndCount({
      where,
      relations: ['wallet'],
      take: limit,
      skip,
      order: { createdAt: 'DESC' }
    });

    return {
      data: result,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      }
    };
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['wallet'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return this.usersRepository.update(userId, {
      is2faEnabled: true,
    });
  }

  async updateStatus(id: string, status: string) {
    return this.usersRepository.update(id, { status });
  }
}
