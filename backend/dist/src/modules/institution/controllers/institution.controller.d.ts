import { InstitutionService } from '../institution.service';
import { UpdateInstitutionDto } from '../dto/update-institution.dto';
export declare class InstitutionController {
    private readonly institutionService;
    constructor(institutionService: InstitutionService);
    getCurrent(): Promise<any>;
    updateCurrent(updateDto: UpdateInstitutionDto): Promise<any>;
}
