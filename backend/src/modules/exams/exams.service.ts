import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ExamsService {
  async scheduleExam(tenantId: string, courseId: string, title: string, scheduledAt: Date, durationMinutes: number, requireWebcam: boolean, secureBrowser: boolean) {
    return prisma.exam.create({
      data: {
        tenantId,
        courseId,
        title,
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        requireWebcam,
        secureBrowser,
      }
    });
  }

  async getExams(tenantId: string, courseId: string) {
    return prisma.exam.findMany({
      where: { tenantId, courseId },
      orderBy: { scheduledAt: 'asc' }
    });
  }

  async startAttempt(tenantId: string, userId: string, examId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId, tenantId }
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    // Check scheduling
    if (exam.scheduledAt && new Date() < exam.scheduledAt) {
      throw new BadRequestException('Exam has not started yet');
    }

    // Check if already started
    const existing = await prisma.examAttempt.findFirst({
      where: { tenantId, examId, userId, completedAt: null }
    });

    if (existing) {
      return existing; // Resume attempt
    }

    return prisma.examAttempt.create({
      data: {
        tenantId,
        examId,
        userId,
      }
    });
  }

  async reportAntiCheat(tenantId: string, userId: string, attemptId: string, flags: any) {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId, tenantId, userId }
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.completedAt) {
      throw new BadRequestException('Exam already completed');
    }

    // Merge new flags
    const existingFlags = (attempt.antiCheatFlags as any) || [];
    existingFlags.push({ timestamp: new Date(), ...flags });

    return prisma.examAttempt.update({
      where: { id: attemptId },
      data: { antiCheatFlags: existingFlags }
    });
  }

  async submitExam(tenantId: string, userId: string, attemptId: string, score: number) {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId, tenantId, userId }
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.completedAt) {
      throw new BadRequestException('Exam already completed');
    }

    return prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        completedAt: new Date(),
        score
      }
    });
  }

  async monitorExam(tenantId: string, userId: string, examId: string) {
    // Mock implementation
    return { success: true, message: 'Webcam monitoring started', examId };
  }
}

