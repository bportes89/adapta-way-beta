import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  index: number;

  @Column()
  timestamp: string;

  @Column('text')
  data: string; // JSON string of transactions

  @Column()
  previousHash: string;

  @Column()
  hash: string;

  @Column('int')
  nonce: number;
}
