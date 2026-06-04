import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, tenantId: string, userId: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(id: string, tenantId: string): Promise<any>;
    update(id: string, updateCourseDto: UpdateCourseDto, tenantId: string): Promise<any>;
    remove(id: string, tenantId: string): Promise<any>;
    clone(id: string, tenantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        newCourseId: string;
    }>;
    createVersion(id: string, tenantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        newVersionId: string;
    }>;
}
