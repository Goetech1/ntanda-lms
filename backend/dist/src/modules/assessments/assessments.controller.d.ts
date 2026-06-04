import { AssessmentsService } from './assessments.service';
export declare class AssessmentsController {
    private readonly service;
    constructor(service: AssessmentsService);
    create(dto: any, tenantId: string): Promise<any>;
    findByCourse(courseId: string, tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    getRandomizedQuiz(id: string, tenantId: string): Promise<any>;
    update(id: string, dto: any, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    addQuestion(assessmentId: string, dto: any, tenantId: string): Promise<any>;
    updateQuestion(questionId: string, dto: any, tenantId: string): Promise<any>;
    deleteQuestion(questionId: string, tenantId: string): Promise<any>;
    submit(assessmentId: string, body: {
        answers: Record<string, any>;
    }, userId: string, tenantId: string): Promise<{
        submission: any;
        score: number;
        totalPoints: any;
        percentage: string;
    }>;
}
