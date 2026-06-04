import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateRoleDto: UpdateRoleDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<{
        success: boolean;
    }>;
    assignPermissions(id: string, permissionIds: string[], tenantId: string): Promise<any>;
}
