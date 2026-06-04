import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';
import { InstitutionService } from './institution.service';
export declare class AcademicSessionService {
    private readonly prisma;
    private readonly institutionService;
    constructor(prisma: PrismaService, institutionService: InstitutionService);
    create(createDto: CreateAcademicSessionDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: UpdateAcademicSessionDto): Promise<any>;
    remove(id: string): Promise<any>;
}
