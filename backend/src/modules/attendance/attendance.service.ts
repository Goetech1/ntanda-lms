import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async markAttendance(data: { courseId: string; userId: string; date: string; status: any; remarks?: string }, tenantId: string) {
    const attendanceDate = new Date(data.date);
    
    return this.prisma.client.attendance.upsert({
      where: {
        tenantId_courseId_userId_date: {
          tenantId,
          courseId: data.courseId,
          userId: data.userId,
          date: attendanceDate,
        }
      },
      update: {
        status: data.status,
        remarks: data.remarks,
      },
      create: {
        tenantId,
        courseId: data.courseId,
        userId: data.userId,
        date: attendanceDate,
        status: data.status,
        remarks: data.remarks,
      }
    });
  }

  async getAttendanceByCourseAndDate(courseId: string, date: string, tenantId: string) {
    return this.prisma.client.attendance.findMany({
      where: {
        tenantId,
        courseId,
        date: new Date(date),
      },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, studentProfile: true }
        }
      }
    });
  }

  async getStudentAttendance(userId: string, courseId: string, tenantId: string) {
    return this.prisma.client.attendance.findMany({
      where: {
        tenantId,
        userId,
        courseId: courseId ? courseId : undefined,
      },
      orderBy: { date: 'desc' },
      include: {
        course: { select: { title: true } }
      }
    });
  }
}
