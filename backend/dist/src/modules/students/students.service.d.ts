import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class StudentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createStudentDto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateStudentDto: any, tenantId: string): Promise<any>;
}
