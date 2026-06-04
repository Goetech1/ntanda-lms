import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { DepartmentService } from './department.service';
import { AcademicSessionService } from './academic-session.service';
import { InstitutionController } from './controllers/institution.controller';
import { DepartmentController } from './controllers/department.controller';
import { AcademicSessionController } from './controllers/academic-session.controller';

@Module({
  controllers: [
    InstitutionController,
    DepartmentController,
    AcademicSessionController,
  ],
  providers: [
    InstitutionService,
    DepartmentService,
    AcademicSessionService,
  ],
  exports: [
    InstitutionService,
    DepartmentService,
    AcademicSessionService,
  ],
})
export class InstitutionModule {}
