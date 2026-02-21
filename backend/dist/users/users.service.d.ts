import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
export declare class UsersService {
    private usersRepository;
    private walletRepository;
    constructor(usersRepository: Repository<User>, walletRepository: Repository<Wallet>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    setTwoFactorAuthenticationSecret(secret: string, userId: string): Promise<import("typeorm").UpdateResult>;
    turnOnTwoFactorAuthentication(userId: string): Promise<import("typeorm").UpdateResult>;
    updateStatus(id: string, status: string): Promise<import("typeorm").UpdateResult>;
}
