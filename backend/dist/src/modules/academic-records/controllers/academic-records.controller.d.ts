import { AcademicRecordsService } from '../academic-records.service';
export declare class AcademicRecordsController {
    private readonly academicRecordsService;
    constructor(academicRecordsService: AcademicRecordsService);
    getTranscript(userId: string): Promise<{
        enrollments: any;
        submissions: any;
        gpa: string;
    }>;
}
