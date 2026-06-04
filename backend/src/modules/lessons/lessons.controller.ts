import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @RequirePermissions('CREATE_COURSE')
  create(@Body() createLessonDto: CreateLessonDto, @GetUser('tenantId') tenantId: string) {
    return this.lessonsService.create(createLessonDto, tenantId);
  }

  @Get()
  @RequirePermissions('READ_COURSE')
  findAll(@Query('moduleId') moduleId: string, @GetUser('tenantId') tenantId: string) {
    if (!moduleId) {
      return [];
    }
    return this.lessonsService.findAll(moduleId, tenantId);
  }

  @Get(':id')
  @RequirePermissions('READ_COURSE')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.lessonsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('UPDATE_COURSE')
  update(
    @Param('id') id: string, 
    @Body() updateLessonDto: UpdateLessonDto, 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.lessonsService.update(id, updateLessonDto, tenantId);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_COURSE')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.lessonsService.remove(id, tenantId);
  }

  @Post('scorm')
  @RequirePermissions('CREATE_COURSE')
  uploadScorm(@Body() data: any, @GetUser('tenantId') tenantId: string) {
    return this.lessonsService.uploadScorm(data, tenantId);
  }
}

