import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string; // 'admin', 'user', 'company'

  @Column({ default: 'active' })
  status: string; // 'active', 'suspended', 'blocked'

  @Column({ default: false })
  is2faEnabled: boolean;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn()
  wallet: Wallet;
}
