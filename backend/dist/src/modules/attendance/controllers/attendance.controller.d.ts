import { AttendanceService } from '../attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(body: any): Promise<any>;
    getByCourseAndDate(courseId: string, date: string): Promise<any>;
    getStudentAttendance(userId: string, courseId: string): Promise<any>;
}
