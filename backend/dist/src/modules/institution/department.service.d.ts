import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InstitutionService } from './institution.service';
export declare class DepartmentService {
    private readonly prisma;
    private readonly institutionService;
    constructor(prisma: PrismaService, institutionService: InstitutionService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<any>;
    remove(id: string): Promise<any>;
}
