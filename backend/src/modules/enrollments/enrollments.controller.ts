import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @RequirePermissions('ENROLL_COURSE')
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @GetUser('tenantId') tenantId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.create(createEnrollmentDto, tenantId, userId);
  }

  @Get('my-enrollments')
  @RequirePermissions('READ_COURSE') // Should perhaps be READ_ENROLLMENT
  findMyEnrollments(@GetUser('tenantId') tenantId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.findAllByUser(userId, tenantId);
  }

  @Get('by-course/:courseId')
  @RequirePermissions('READ_ENROLLMENT')
  findByCourse(@Param('courseId') courseId: string, @GetUser('tenantId') tenantId: string) {
    return this.enrollmentsService.findAllByCourse(courseId, tenantId);
  }

  @Patch(':id/progress')
  @RequirePermissions('UPDATE_ENROLLMENT_PROGRESS')
  updateProgress(
    @Param('id') id: string, 
    @Body('progress') progress: number,
    @GetUser('tenantId') tenantId: string
  ) {
    return this.enrollmentsService.updateProgress(id, progress, tenantId);
  }
}
