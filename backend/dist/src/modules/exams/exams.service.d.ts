export declare class ExamsService {
    scheduleExam(tenantId: string, courseId: string, title: string, scheduledAt: Date, durationMinutes: number, requireWebcam: boolean, secureBrowser: boolean): Promise<{
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
    getExams(tenantId: string, courseId: string): Promise<{
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
    startAttempt(tenantId: string, userId: string, examId: string): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    reportAntiCheat(tenantId: string, userId: string, attemptId: string, flags: any): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    submitExam(tenantId: string, userId: string, attemptId: string, score: number): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        examId: string;
        startedAt: Date;
        antiCheatFlags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    monitorExam(tenantId: string, userId: string, examId: string): Promise<{
        success: boolean;
        message: string;
        examId: string;
    }>;
}
