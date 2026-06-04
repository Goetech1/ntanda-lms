import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    askTutor(req: any, body: {
        question: string;
        courseId?: string;
    }): Promise<{
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
    generateQuiz(req: any, body: {
        topic: string;
        questionCount?: number;
        difficulty?: string;
    }): Promise<{
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
        answer: string;
        tokensUsed: number;
        questions?: undefined;
        recommendations?: undefined;
        result?: undefined;
    } | {
        questions: any[];
        tokensUsed: any;
    }>;
    getRecommendations(req: any): Promise<{
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
        answer: string;
        tokensUsed: number;
        questions?: undefined;
        recommendations?: undefined;
        result?: undefined;
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
}
