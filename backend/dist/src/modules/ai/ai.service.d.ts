export declare class AiService {
    private readonly logger;
    private openai;
    constructor();
    askTutor(tenantId: string, userId: string, question: string, courseId?: string): Promise<{
        answer: string;
        tokensUsed: number;
        questions?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        questions: any;
        tokensUsed: number;
        answer?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        recommendations: any;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        result?: undefined;
    } | {
        result: string;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        recommendations?: undefined;
    }>;
    generateQuiz(tenantId: string, userId: string, topic: string, questionCount?: number, difficulty?: string): Promise<{
        answer: string;
        tokensUsed: number;
        questions?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        questions: any;
        tokensUsed: number;
        answer?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        recommendations: any;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        result?: undefined;
    } | {
        result: string;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        recommendations?: undefined;
    }>;
    getRecommendations(tenantId: string, userId: string): Promise<{
        answer: string;
        tokensUsed: number;
        questions?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        questions: any;
        tokensUsed: number;
        answer?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        recommendations: any;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        result?: undefined;
    } | {
        result: string;
        tokensUsed: number;
        answer?: undefined;
        questions?: undefined;
        recommendations?: undefined;
    } | {
        recommendations: any[];
        message: string;
    }>;
    private logInteraction;
    private mockResponse;
}
