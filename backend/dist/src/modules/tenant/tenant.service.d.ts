import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<any>;
    remove(id: string): Promise<any>;
}
