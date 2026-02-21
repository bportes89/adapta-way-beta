import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
export declare class NftsController {
    private readonly nftsService;
    constructor(nftsService: NftsService);
    create(createNftDto: CreateNftDto, req: any): Promise<import("./entities/nft.entity").Nft>;
    findAll(): Promise<import("./entities/nft.entity").Nft[]>;
    findMyNfts(req: any): Promise<import("./entities/nft.entity").Nft[]>;
    findOne(id: string): Promise<import("./entities/nft.entity").Nft | null>;
    update(id: string, updateNftDto: UpdateNftDto): string;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
