import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    askTutor(req: any, body: {
        question: string;
        courseId?: string;
    }): Promise<{
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
    generateQuiz(req: any, body: {
        topic: string;
        questionCount?: number;
        difficulty?: string;
    }): Promise<{
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
    getRecommendations(req: any): Promise<{
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
}
