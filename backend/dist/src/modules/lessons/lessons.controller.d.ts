import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(createLessonDto: CreateLessonDto, tenantId: string): Promise<any>;
    findAll(moduleId: string, tenantId: string): any[] | Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateLessonDto: UpdateLessonDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    uploadScorm(data: any, tenantId: string): Promise<{
        success: boolean;
        message: string;
        lessonId: string;
    }>;
}
