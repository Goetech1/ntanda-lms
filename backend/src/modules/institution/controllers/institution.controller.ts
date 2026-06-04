import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { InstitutionService } from '../institution.service';
import { UpdateInstitutionDto } from '../dto/update-institution.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequireTenant } from '../../../common/decorators/require-tenant.decorator';

@Controller('institutions/current')
@UseGuards(JwtAuthGuard)
@RequireTenant()
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  getCurrent() {
    return this.institutionService.getCurrentInstitution();
  }

  @Patch()
  updateCurrent(@Body() updateDto: UpdateInstitutionDto) {
    return this.institutionService.updateCurrentInstitution(updateDto);
  }
}
