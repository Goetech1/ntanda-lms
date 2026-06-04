import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from '../students.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequireTenant } from '../../../common/decorators/require-tenant.decorator';
import { tenantStorage } from '../../../app.module';

@Controller('students')
@UseGuards(JwtAuthGuard)
@RequireTenant()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: any) {
    const tenantId = tenantStorage.getStore();
    return this.studentsService.create(createStudentDto, tenantId);
  }

  @Get()
  findAll() {
    const tenantId = tenantStorage.getStore();
    return this.studentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const tenantId = tenantStorage.getStore();
    return this.studentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: any) {
    const tenantId = tenantStorage.getStore();
    return this.studentsService.update(id, updateStudentDto, tenantId);
  }
}
