import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class PermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
}
