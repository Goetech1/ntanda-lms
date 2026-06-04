import { PrismaService } from '../../../infrastructure/database/prisma.service';
export declare class GoogleMeetIntegrationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createMeeting(tenantId: string, instructorId: string, title: string): Promise<{
        meetingId: string;
        joinUrl: string;
    }>;
}
