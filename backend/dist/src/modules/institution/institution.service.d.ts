import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
export declare class InstitutionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCurrentInstitution(): Promise<any>;
    updateCurrentInstitution(updateDto: UpdateInstitutionDto): Promise<any>;
}
