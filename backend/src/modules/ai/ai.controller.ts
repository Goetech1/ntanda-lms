import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('v1/ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /api/v1/ai/tutor
   * Ask the AI Tutor a question.
   * Access: STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN
   */
  @Post('tutor')
  async askTutor(@Req() req: any, @Body() body: { question: string; courseId?: string }) {
    return this.aiService.askTutor(req.tenantId, req.user.id, body.question, body.courseId);
  }

  /**
   * POST /api/v1/ai/quiz-generator
   * Generate an MCQ quiz using AI.
   * Access: INSTRUCTOR, ADMIN, SUPER_ADMIN
   */
  @Post('quiz-generator')
  @Roles('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN')
  async generateQuiz(
    @Req() req: any,
    @Body() body: { topic: string; questionCount?: number; difficulty?: string }
  ) {
    return this.aiService.generateQuiz(
      req.tenantId,
      req.user.id,
      body.topic,
      body.questionCount,
      body.difficulty
    );
  }

  /**
   * GET /api/v1/ai/recommendations
   * Get personalized course recommendations based on student profile.
   * Access: STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN
   */
  @Get('recommendations')
  async getRecommendations(@Req() req: any) {
    return this.aiService.getRecommendations(req.tenantId, req.user.id);
  }
}
