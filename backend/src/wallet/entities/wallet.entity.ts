import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  address: string;

  @Column('decimal', { default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.wallet)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.fromWallet)
  transactionsSent: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toWallet)
  transactionsReceived: Transaction[];
}
