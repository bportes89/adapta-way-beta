import { Repository } from 'typeorm';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Nft } from './entities/nft.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
export declare class NftsService {
    private nftRepository;
    private walletRepository;
    private blockchainService;
    constructor(nftRepository: Repository<Nft>, walletRepository: Repository<Wallet>, blockchainService: BlockchainService);
    create(createNftDto: CreateNftDto, userId: string): Promise<Nft>;
    findAll(): Promise<Nft[]>;
    findMyNfts(userId: string): Promise<Nft[]>;
    findOne(id: string): Promise<Nft | null>;
    update(id: string, updateNftDto: UpdateNftDto): string;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
