import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(page?: number, limit?: number, search?: string): Promise<import("./entities/user.entity").User[] | {
        data: import("./entities/user.entity").User[];
        meta: {
            total: number;
            page: any;
            last_page: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    updateStatus(id: string, body: UpdateUserStatusDto): Promise<import("typeorm").UpdateResult>;
    updateRole(id: string, body: UpdateUserRoleDto): Promise<import("typeorm").UpdateResult>;
    uploadPhoto(id: string, file: Express.Multer.File): Promise<{
        photoUrl: string;
    }>;
}
