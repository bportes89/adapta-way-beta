import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './entities/blockchain.entity';
import * as crypto from 'crypto';

@Injectable()
export class BlockchainService implements OnModuleInit {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  async onModuleInit() {
    // Check if genesis block exists, if not create it
    const count = await this.blockRepository.count();
    if (count === 0) {
      await this.createGenesisBlock();
    }
  }

  private async createGenesisBlock() {
    const genesisBlock = new Block();
    genesisBlock.index = 0;
    genesisBlock.timestamp = new Date().toISOString();
    genesisBlock.data = JSON.stringify({ message: 'Genesis Block' });
    genesisBlock.previousHash = '0';
    genesisBlock.nonce = 0;
    genesisBlock.hash = this.calculateHash(genesisBlock);

    await this.blockRepository.save(genesisBlock);
    console.log('Genesis Block created');
  }

  async createBlock(data: any) {
    const lastBlock = await this.getLastBlock();
    const newBlock = new Block();
    newBlock.index = lastBlock.index + 1;
    newBlock.timestamp = new Date().toISOString();
    newBlock.data = JSON.stringify(data);
    newBlock.previousHash = lastBlock.hash;
    newBlock.nonce = 0;
    
    // Proof of Work Simulation (Difficulty: 2 leading zeros)
    // In a real scenario, this would be much harder (e.g. 4+ zeros)
    this.mineBlock(newBlock, 2);

    return this.blockRepository.save(newBlock);
  }

  private mineBlock(block: Block, difficulty: number) {
    const target = Array(difficulty + 1).join('0');
    while (true) {
      block.hash = this.calculateHash(block);
      if (block.hash.substring(0, difficulty) === target) {
        break;
      }
      block.nonce++;
    }
    console.log(`Block mined: ${block.hash}`);
  }

  async getChain() {
    return this.blockRepository.find({ order: { index: 'ASC' } });
  }

  async getLastBlock(): Promise<Block> {
    const blocks = await this.blockRepository.find({
      order: { index: 'DESC' },
      take: 1,
    });
    return blocks[0];
  }

  async isValidChain(): Promise<boolean> {
    const chain = await this.getChain();
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  private calculateHash(block: Block): string {
    const { index, timestamp, data, previousHash, nonce } = block;
    return crypto
      .createHash('sha256')
      .update(index + timestamp + data + previousHash + nonce)
      .digest('hex');
  }
}
