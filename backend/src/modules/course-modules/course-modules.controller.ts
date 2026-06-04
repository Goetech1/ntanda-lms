import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('course-modules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Post()
  @RequirePermissions('CREATE_COURSE')
  create(@Body() createCourseModuleDto: CreateCourseModuleDto, @GetUser('tenantId') tenantId: string) {
    return this.courseModulesService.create(createCourseModuleDto, tenantId);
  }

  @Get()
  @RequirePermissions('READ_COURSE')
  findAll(@Query('courseId') courseId: string, @GetUser('tenantId') tenantId: string) {
    if (!courseId) {
      return [];
    }
    return this.courseModulesService.findAll(courseId, tenantId);
  }

  @Get(':id')
  @RequirePermissions('READ_COURSE')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.courseModulesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('UPDATE_COURSE')
  update(
    @Param('id') id: string, 
    @Body() updateCourseModuleDto: UpdateCourseModuleDto, 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.courseModulesService.update(id, updateCourseModuleDto, tenantId);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_COURSE')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.courseModulesService.remove(id, tenantId);
  }
}
