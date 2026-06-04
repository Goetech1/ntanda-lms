import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto, tenantId: string, instructorId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateCourseDto: UpdateCourseDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    clone(id: string, tenantId: string, instructorId: string): Promise<{
        success: boolean;
        message: string;
        newCourseId: string;
    }>;
    createVersion(id: string, tenantId: string, instructorId: string): Promise<{
        success: boolean;
        message: string;
        newVersionId: string;
    }>;
}
