import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class AssessmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: any, tenantId: string): Promise<any>;
    findByCourse(courseId: string, tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, dto: any, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    addQuestion(assessmentId: string, dto: any, tenantId: string): Promise<any>;
    updateQuestion(questionId: string, dto: any, tenantId: string): Promise<any>;
    deleteQuestion(questionId: string, tenantId: string): Promise<any>;
    getRandomizedQuiz(assessmentId: string, tenantId: string): Promise<any>;
    submit(assessmentId: string, userId: string, answers: Record<string, any>, tenantId: string): Promise<{
        submission: any;
        score: number;
        totalPoints: any;
        percentage: string;
    }>;
}
