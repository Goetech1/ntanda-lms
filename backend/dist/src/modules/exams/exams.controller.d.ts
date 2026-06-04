import { ExamsService } from './exams.service';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    scheduleExam(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        title: string;
        courseId: string;
        scheduledAt: Date | null;
        durationMinutes: number;
        requireWebcam: boolean;
        secureBrowser: boolean;
    }>;
    getExams(req: any, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        updatedAt: Date;
        title: string;
        courseId: string;
        scheduledAt: Date | null;
        durationMinutes: number;
        requireWebcam: boolean;
        secureBrowser: boolean;
    }[]>;
    startAttempt(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    reportAntiCheat(req: any, id: string, flags: any): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    submitExam(req: any, id: string, score: number): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    monitorExam(req: any, id: string): Promise<{
        success: boolean;
        message: string;
        examId: string;
    }>;
}
