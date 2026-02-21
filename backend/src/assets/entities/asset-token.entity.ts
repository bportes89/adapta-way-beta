import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Asset } from './asset.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class AssetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  amount: number;

  @ManyToOne(() => Asset, (asset) => asset.tokens)
  asset: Asset;

  @ManyToOne(() => Wallet)
  wallet: Wallet;
}
