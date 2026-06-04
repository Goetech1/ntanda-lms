import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Assessments (Quiz/Assignment) ──────────────────────────────────────────

  async create(dto: any, tenantId: string) {
    return this.prisma.client.assessment.create({
      data: {
        tenantId,
        courseId: dto.courseId,
        title: dto.title,
        type: dto.type,
        timeLimitMinutes: dto.timeLimitMinutes,
        totalPoints: dto.totalPoints || 0,
      },
    });
  }

  async findByCourse(courseId: string, tenantId: string) {
    return this.prisma.client.assessment.findMany({
      where: { courseId, tenantId, deletedAt: null },
      include: { _count: { select: { questions: true, submissions: true } } },
    });
  }

  async findOne(id: string, tenantId: string) {
    const assessment = await this.prisma.client.assessment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { submissions: true } },
      },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async update(id: string, dto: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.client.assessment.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.client.assessment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Question Bank ──────────────────────────────────────────────────────────

  async addQuestion(assessmentId: string, dto: any, tenantId: string) {
    const assessment = await this.findOne(assessmentId, tenantId);
    const count = await this.prisma.client.question.count({ where: { assessmentId } });

    const question = await this.prisma.client.question.create({
      data: {
        tenantId,
        assessmentId,
        content: dto.content,
        options: dto.options,
        correctAnswer: dto.correctAnswer,
        points: dto.points || 1,
        orderIndex: count + 1,
      },
    });

    // Recalculate total points
    const total = await this.prisma.client.question.aggregate({
      where: { assessmentId },
      _sum: { points: true },
    });
    await this.prisma.client.assessment.update({
      where: { id: assessmentId },
      data: { totalPoints: total._sum.points || 0 },
    });

    return question;
  }

  async updateQuestion(questionId: string, dto: any, tenantId: string) {
    const question = await this.prisma.client.question.findFirst({ where: { id: questionId, tenantId } });
    if (!question) throw new NotFoundException('Question not found');
    return this.prisma.client.question.update({ where: { id: questionId }, data: dto });
  }

  async deleteQuestion(questionId: string, tenantId: string) {
    const question = await this.prisma.client.question.findFirst({ where: { id: questionId, tenantId } });
    if (!question) throw new NotFoundException('Question not found');
    return this.prisma.client.question.delete({ where: { id: questionId } });
  }

  // ─── Randomized Quiz Attempt ─────────────────────────────────────────────────

  async getRandomizedQuiz(assessmentId: string, tenantId: string) {
    const assessment = await this.findOne(assessmentId, tenantId);
    const questions = [...assessment.questions] as any[];
    // Fisher–Yates shuffle for randomization
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    // Strip correct answers from response
    return {
      ...assessment,
      questions: questions.map(({ correctAnswer, ...q }: any) => q),
    };
  }

  // ─── Auto Grading Engine ─────────────────────────────────────────────────────

  async submit(assessmentId: string, userId: string, answers: Record<string, any>, tenantId: string) {
    const assessment = await this.findOne(assessmentId, tenantId);
    const questions = assessment.questions as any[];

    let score = 0;
    for (const question of questions) {
      const userAnswer = answers[question.id];
      const correct = question.correctAnswer;
      // Simple equality check; handles MCQ, True/False, Fill-in-blank
      if (JSON.stringify(userAnswer) === JSON.stringify(correct)) {
        score += question.points;
      }
    }

    const submission = await this.prisma.client.submission.create({
      data: {
        tenantId,
        assessmentId,
        userId,
        answers,
        score,
        status: 'GRADED',
      },
    });

    return { submission, score, totalPoints: assessment.totalPoints, percentage: ((score / assessment.totalPoints) * 100).toFixed(1) };
  }
}
