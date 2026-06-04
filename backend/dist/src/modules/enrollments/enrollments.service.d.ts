import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, userId: string): Promise<any>;
    findAllByUser(userId: string, tenantId: string): Promise<any>;
    findAllByCourse(courseId: string, tenantId: string): Promise<any>;
    updateProgress(id: string, progressPercentage: number, tenantId: string): Promise<any>;
}
