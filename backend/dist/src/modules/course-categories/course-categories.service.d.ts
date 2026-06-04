import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class CourseCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, dto: any, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
}
