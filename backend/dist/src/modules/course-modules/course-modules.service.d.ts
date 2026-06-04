import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
export declare class CourseModulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseModuleDto: CreateCourseModuleDto, tenantId: string): Promise<any>;
    findAll(courseId: string, tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateCourseModuleDto: UpdateCourseModuleDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
}
