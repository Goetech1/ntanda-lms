import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('v1/exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  async scheduleExam(@Req() req: any, @Body() body: any) {
    return this.examsService.scheduleExam(
      req.tenantId,
      body.courseId,
      body.title,
      body.scheduledAt,
      body.durationMinutes,
      body.requireWebcam,
      body.secureBrowser
    );
  }

  @Get('course/:courseId')
  async getExams(@Req() req: any, @Param('courseId') courseId: string) {
    return this.examsService.getExams(req.tenantId, courseId);
  }

  @Post(':id/attempts/start')
  async startAttempt(@Req() req: any, @Param('id') id: string) {
    return this.examsService.startAttempt(req.tenantId, req.user.id, id);
  }

  @Patch('attempts/:id/anti-cheat')
  async reportAntiCheat(@Req() req: any, @Param('id') id: string, @Body() flags: any) {
    return this.examsService.reportAntiCheat(req.tenantId, req.user.id, id, flags);
  }

  @Post('attempts/:id/submit')
  async submitExam(@Req() req: any, @Param('id') id: string, @Body('score') score: number) {
    return this.examsService.submitExam(req.tenantId, req.user.id, id, score);
  }

  @Post(':id/monitor')
  async monitorExam(@Req() req: any, @Param('id') id: string) {
    return this.examsService.monitorExam(req.tenantId, req.user.id, id);
  }
}

