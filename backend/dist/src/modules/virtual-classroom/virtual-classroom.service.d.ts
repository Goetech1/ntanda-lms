import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ZoomIntegrationService } from './services/zoom-integration.service';
export declare class VirtualClassroomService {
    private prisma;
    private zoomService;
    constructor(prisma: PrismaService, zoomService: ZoomIntegrationService);
    scheduleClass(tenantId: string, instructorId: string, data: any): Promise<any>;
    listClasses(tenantId: string, courseId?: string): Promise<any>;
    registerForWebinar(tenantId: string, virtualClassId: string, email: string, fullName: string, userId?: string): Promise<any>;
}
