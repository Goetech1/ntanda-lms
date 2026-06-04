import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class InstructorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: any, tenantId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, dto: any, tenantId: string): Promise<any>;
    getPerformance(id: string, tenantId: string): Promise<{
        totalCourses: number;
        publishedCourses: number;
        totalStudents: any;
        avgScore: string;
    }>;
}
