import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class AcademicRecordsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStudentTranscript(userId: string, tenantId: string): Promise<{
        enrollments: any;
        submissions: any;
        gpa: string;
    }>;
}
