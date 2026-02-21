import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-json', { nullable: true })
  metadata: any;

  @Column({ nullable: true })
  blockchainHash: string;

  @ManyToOne(() => Wallet, { nullable: true })
  owner: Wallet;

  @Column()
  createdAt: Date;
}
