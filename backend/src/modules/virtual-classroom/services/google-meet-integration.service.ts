import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class GoogleMeetIntegrationService {
  private readonly logger = new Logger(GoogleMeetIntegrationService.name);

  constructor(private prisma: PrismaService) {}

  async createMeeting(tenantId: string, instructorId: string, title: string) {
    this.logger.log(`Creating Google Meet for tenant ${tenantId}`);
    return {
      meetingId: 'meet-123',
      joinUrl: 'https://meet.google.com/abc-defg-hij',
    };
  }
}
