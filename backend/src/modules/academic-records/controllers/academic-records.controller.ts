import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AcademicRecordsService } from '../academic-records.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequireTenant } from '../../../common/decorators/require-tenant.decorator';
import { tenantStorage } from '../../../app.module';

@Controller('academic-records')
@UseGuards(JwtAuthGuard)
@RequireTenant()
export class AcademicRecordsController {
  constructor(private readonly academicRecordsService: AcademicRecordsService) {}

  @Get('student/:userId/transcript')
  getTranscript(@Param('userId') userId: string) {
    const tenantId = tenantStorage.getStore();
    return this.academicRecordsService.getStudentTranscript(userId, tenantId);
  }
}
