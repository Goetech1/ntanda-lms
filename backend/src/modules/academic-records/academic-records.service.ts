import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AcademicRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentTranscript(userId: string, tenantId: string) {
    const enrollments = await this.prisma.client.enrollment.findMany({
      where: { userId, tenantId },
      include: {
        course: { select: { title: true, id: true } }
      }
    });

    const submissions = await this.prisma.client.submission.findMany({
      where: { userId, tenantId },
      include: {
        assessment: { select: { title: true, totalPoints: true, courseId: true } }
      }
    });

    // Compute basic GPA logic (mocked up based on completed courses and scores)
    let totalScore = 0;
    let totalPossible = 0;

    submissions.forEach(sub => {
      if (sub.score !== null) {
        totalScore += sub.score;
        totalPossible += sub.assessment.totalPoints;
      }
    });

    const gpaPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    
    // Scale 0-100 to 0.0 - 4.0
    const calculatedGpa = (gpaPercentage / 100) * 4.0;

    // Save calculated GPA to student profile
    await this.prisma.client.studentProfile.updateMany({
      where: { userId, tenantId },
      data: { gpa: calculatedGpa }
    });

    return {
      enrollments,
      submissions,
      gpa: calculatedGpa.toFixed(2),
    };
  }
}
