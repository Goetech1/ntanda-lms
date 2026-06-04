import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { AttendanceService } from '../attendance.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequireTenant } from '../../../common/decorators/require-tenant.decorator';
import { tenantStorage } from '../../../app.module';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
@RequireTenant()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() body: any) {
    const tenantId = tenantStorage.getStore();
    return this.attendanceService.markAttendance(body, tenantId);
  }

  @Get('course/:courseId')
  getByCourseAndDate(@Param('courseId') courseId: string, @Query('date') date: string) {
    const tenantId = tenantStorage.getStore();
    return this.attendanceService.getAttendanceByCourseAndDate(courseId, date, tenantId);
  }

  @Get('student/:userId')
  getStudentAttendance(@Param('userId') userId: string, @Query('courseId') courseId: string) {
    const tenantId = tenantStorage.getStore();
    return this.attendanceService.getStudentAttendance(userId, courseId, tenantId);
  }
}
