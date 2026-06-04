import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('instructors')
@UseGuards(JwtAuthGuard)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(@Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.instructorsService.create(dto, tenantId);
  }

  @Get()
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.instructorsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.instructorsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.instructorsService.update(id, dto, tenantId);
  }

  @Get(':id/performance')
  getPerformance(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.instructorsService.getPerformance(id, tenantId);
  }
}
