export declare class AiService {
    private readonly logger;
    private openai;
    constructor();
    askTutor(tenantId: string, userId: string, question: string, courseId?: string): Promise<{
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
        answer: any;
        tokensUsed: any;
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
    } | {
        questions: any[];
        tokensUsed: any;
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
        tokensUsed?: undefined;
    } | {
        recommendations: {
            id: string;
            description: string;
            title: string;
            category: {
                name: string;
            };
        }[];
        tokensUsed: any;
        message?: undefined;
    }>;
    private logInteraction;
    private mockResponse;
}
