import { AcademicSessionService } from '../academic-session.service';
import { CreateAcademicSessionDto } from '../dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from '../dto/update-academic-session.dto';
export declare class AcademicSessionController {
    private readonly academicSessionService;
    constructor(academicSessionService: AcademicSessionService);
    create(createDto: CreateAcademicSessionDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: UpdateAcademicSessionDto): Promise<any>;
    remove(id: string): Promise<any>;
}
