import { Module } from '@nestjs/common';
import { AcademicRecordsService } from './academic-records.service';
import { AcademicRecordsController } from './controllers/academic-records.controller';

@Module({
  controllers: [AcademicRecordsController],
  providers: [AcademicRecordsService],
  exports: [AcademicRecordsService],
})
export class AcademicRecordsModule {}
