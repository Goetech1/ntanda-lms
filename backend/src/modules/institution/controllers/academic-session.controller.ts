import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AcademicSessionService } from '../academic-session.service';
import { CreateAcademicSessionDto } from '../dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from '../dto/update-academic-session.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequireTenant } from '../../../common/decorators/require-tenant.decorator';

@Controller('academic-sessions')
@UseGuards(JwtAuthGuard)
@RequireTenant()
export class AcademicSessionController {
  constructor(private readonly academicSessionService: AcademicSessionService) {}

  @Post()
  create(@Body() createDto: CreateAcademicSessionDto) {
    return this.academicSessionService.create(createDto);
  }

  @Get()
  findAll() {
    return this.academicSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicSessionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAcademicSessionDto) {
    return this.academicSessionService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicSessionService.remove(id);
  }
}
