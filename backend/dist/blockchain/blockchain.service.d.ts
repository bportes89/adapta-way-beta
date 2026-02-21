import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Block } from './entities/blockchain.entity';
export declare class BlockchainService implements OnModuleInit {
    private blockRepository;
    constructor(blockRepository: Repository<Block>);
    onModuleInit(): Promise<void>;
    private createGenesisBlock;
    createBlock(data: any): Promise<Block>;
    private mineBlock;
    getChain(): Promise<Block[]>;
    getLastBlock(): Promise<Block>;
    isValidChain(): Promise<boolean>;
    private calculateHash;
}
