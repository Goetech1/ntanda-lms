import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, userId: string): Promise<any>;
    findMyEnrollments(tenantId: string, userId: string): Promise<any>;
    findByCourse(courseId: string, tenantId: string): Promise<any>;
    updateProgress(id: string, progress: number, tenantId: string): Promise<any>;
}
