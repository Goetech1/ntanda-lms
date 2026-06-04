import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @RequirePermissions('CREATE_COURSE')
  create(@Body() createCourseDto: CreateCourseDto, @GetUser('tenantId') tenantId: string, @GetUser('id') userId: string) {
    return this.coursesService.create(createCourseDto, tenantId, userId);
  }

  @Get()
  @RequirePermissions('READ_COURSE')
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.coursesService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermissions('READ_COURSE')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.coursesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('UPDATE_COURSE')
  update(
    @Param('id') id: string, 
    @Body() updateCourseDto: UpdateCourseDto, 
    @GetUser('tenantId') tenantId: string
  ) {
    return this.coursesService.update(id, updateCourseDto, tenantId);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_COURSE')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.coursesService.remove(id, tenantId);
  }

  @Post(':id/clone')
  @RequirePermissions('CREATE_COURSE')
  clone(@Param('id') id: string, @GetUser('tenantId') tenantId: string, @GetUser('id') userId: string) {
    return this.coursesService.clone(id, tenantId, userId);
  }

  @Post(':id/versions')
  @RequirePermissions('CREATE_COURSE')
  createVersion(@Param('id') id: string, @GetUser('tenantId') tenantId: string, @GetUser('id') userId: string) {
    return this.coursesService.createVersion(id, tenantId, userId);
  }
}

