import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<{
        success: boolean;
    }>;
}
