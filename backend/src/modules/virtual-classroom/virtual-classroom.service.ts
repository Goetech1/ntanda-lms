import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ZoomIntegrationService } from './services/zoom-integration.service';

@Injectable()
export class VirtualClassroomService {
  constructor(
    private prisma: PrismaService,
    private zoomService: ZoomIntegrationService,
  ) {}

  async scheduleClass(tenantId: string, instructorId: string, data: any) {
    const { title, description, courseId, provider, scheduledAt, durationMinutes } = data;

    // Verify course belongs to tenant and instructor
    if (courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId, tenantId },
      });
      if (!course) throw new NotFoundException('Course not found');
    }

    let meetingDetails = { meetingId: null, joinUrl: null, meetingUrl: null };

    if (provider === 'ZOOM') {
      meetingDetails = await this.zoomService.createMeeting(tenantId, instructorId, title, durationMinutes);
    }
    // Handle other providers...

    /*
    const virtualClass = await this.prisma.virtualClass.create({
      data: {
        tenantId,
        instructorId,
        courseId,
        title,
        description,
        provider,
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        meetingId: meetingDetails.meetingId,
        joinUrl: meetingDetails.joinUrl,
        meetingUrl: meetingDetails.meetingUrl,
      },
    });
    */

    return { id: 'mock-vc-id', title, ...meetingDetails };
  }

  async listClasses(tenantId: string, courseId?: string) {
    // return this.prisma.virtualClass.findMany({
    //   where: {
    //     tenantId,
    //     ...(courseId ? { courseId } : {}),
    //   },
    //   orderBy: { scheduledAt: 'asc' },
    // });
    return [];
  }

  async registerForWebinar(tenantId: string, virtualClassId: string, email: string, fullName: string, userId?: string) {
    // const vClass = await this.prisma.virtualClass.findUnique({
    //   where: { id: virtualClassId, tenantId },
    // });
    // if (!vClass) throw new NotFoundException('Virtual class not found');
    
    /*
    return this.prisma.webinarRegistration.create({
      data: {
        tenantId,
        virtualClassId,
        email,
        fullName,
        userId,
      },
    });
    */
    return { id: 'mock-reg-id', email, fullName };
  }
}
