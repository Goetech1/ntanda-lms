import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, userId: string) {
    // Check if already enrolled
    const existing = await this.prisma.client.enrollment.findUnique({
      where: {
        tenantId_userId_courseId: {
          tenantId,
          userId,
          courseId: createEnrollmentDto.courseId,
        }
      }
    });

    if (existing) {
      throw new ConflictException('User is already enrolled in this course');
    }

    return this.prisma.client.enrollment.create({
      data: {
        tenantId,
        userId,
        courseId: createEnrollmentDto.courseId,
        progressPercentage: 0,
      },
    });
  }

  async findAllByUser(userId: string, tenantId: string) {
    return this.prisma.client.enrollment.findMany({
      where: { userId, tenantId },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, fullName: true }
            }
          }
        }
      }
    });
  }

  async findAllByCourse(courseId: string, tenantId: string) {
    return this.prisma.client.enrollment.findMany({
      where: { courseId, tenantId },
      include: {
        user: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });
  }

  async updateProgress(id: string, progressPercentage: number, tenantId: string) {
    const enrollment = await this.prisma.client.enrollment.findFirst({
      where: { id, tenantId },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return this.prisma.client.enrollment.update({
      where: { id },
      data: {
        progressPercentage,
        completedAt: progressPercentage === 100 ? new Date() : null,
      },
    });
  }
}
