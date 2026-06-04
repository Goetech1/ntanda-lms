import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLessonDto: CreateLessonDto, tenantId: string): Promise<any>;
    findAll(moduleId: string, tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateLessonDto: UpdateLessonDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    uploadScorm(data: any, tenantId: string): Promise<{
        success: boolean;
        message: string;
        lessonId: string;
    }>;
}
