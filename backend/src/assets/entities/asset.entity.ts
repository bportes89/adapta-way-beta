import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AssetToken } from './asset-token.entity';

export enum AssetType {
  COMPANY = 'COMPANY',
  PROJECT = 'PROJECT',
  PATENT = 'PATENT',
  RIGHTS = 'RIGHTS',
}

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'simple-enum',
    enum: AssetType,
    default: AssetType.PROJECT,
  })
  type: AssetType;

  @Column('int')
  totalSupply: number;

  @Column('int') // How many tokens are still available to be bought
  availableSupply: number;

  @Column('decimal')
  referenceValue: number; // Price per token in AdaptaCoin

  @OneToMany(() => AssetToken, (token) => token.asset)
  tokens: AssetToken[];
}
