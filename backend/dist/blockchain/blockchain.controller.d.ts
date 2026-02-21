import { BlockchainService } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    getChain(): Promise<import("./entities/blockchain.entity").Block[]>;
    mineBlock(body: any): Promise<import("./entities/blockchain.entity").Block>;
    isValid(): Promise<boolean>;
}
