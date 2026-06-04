import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Post()
  create(@Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.create(dto, tenantId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string, @GetUser('tenantId') tenantId: string) {
    return this.service.findByCourse(courseId, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Get(':id/quiz')
  getRandomizedQuiz(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.service.getRandomizedQuiz(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.update(id, dto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.service.remove(id, tenantId);
  }

  // ─── Questions ───────────────────────────────────────────────────────────────

  @Post(':id/questions')
  addQuestion(@Param('id') assessmentId: string, @Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.addQuestion(assessmentId, dto, tenantId);
  }

  @Patch('questions/:questionId')
  updateQuestion(@Param('questionId') questionId: string, @Body() dto: any, @GetUser('tenantId') tenantId: string) {
    return this.service.updateQuestion(questionId, dto, tenantId);
  }

  @Delete('questions/:questionId')
  deleteQuestion(@Param('questionId') questionId: string, @GetUser('tenantId') tenantId: string) {
    return this.service.deleteQuestion(questionId, tenantId);
  }

  // ─── Submission + Auto-Grading ───────────────────────────────────────────────

  @Post(':id/submit')
  submit(
    @Param('id') assessmentId: string,
    @Body() body: { answers: Record<string, any> },
    @GetUser('id') userId: string,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.service.submit(assessmentId, userId, body.answers, tenantId);
  }
}
