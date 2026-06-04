import { PrismaService } from '../../../infrastructure/database/prisma.service';
export declare class MsTeamsIntegrationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createMeeting(tenantId: string, instructorId: string, title: string, durationMinutes: number): Promise<{
        meetingId: string;
        joinUrl: string;
        meetingUrl: string;
    }>;
}
