import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  MINT = 'MINT',
  BURN = 'BURN',
  BUY_ASSET = 'BUY_ASSET',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'simple-enum',
    enum: TransactionType,
    default: TransactionType.TRANSFER,
  })
  type: TransactionType;

  @ManyToOne(() => Wallet, { nullable: true })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet, { nullable: true })
  toWallet: Wallet;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  hash: string; // Hash of this transaction for blockchain verification
}
