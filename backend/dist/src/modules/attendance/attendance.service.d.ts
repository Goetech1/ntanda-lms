import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class AttendanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    markAttendance(data: {
        courseId: string;
        userId: string;
        date: string;
        status: any;
        remarks?: string;
    }, tenantId: string): Promise<any>;
    getAttendanceByCourseAndDate(courseId: string, date: string, tenantId: string): Promise<any>;
    getStudentAttendance(userId: string, courseId: string, tenantId: string): Promise<any>;
}
