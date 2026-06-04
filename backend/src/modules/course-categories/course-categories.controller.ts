import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CourseCategoriesService } from './course-categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('course-categories')
@UseGuards(JwtAuthGuard)
export class CourseCategoriesController {
  constructor(private readonly service: CourseCategoriesService) {}

  @Post()
  create(@Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.create(dto, tenantId);
  }

  @Get()
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.update(id, dto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.service.remove(id, tenantId);
  }
}
