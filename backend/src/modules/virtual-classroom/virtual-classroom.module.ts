import { Module } from '@nestjs/common';
import { VirtualClassroomController } from './virtual-classroom.controller';
import { VirtualClassroomService } from './virtual-classroom.service';
import { ZoomIntegrationService } from './services/zoom-integration.service';
import { GoogleMeetIntegrationService } from './services/google-meet-integration.service';
import { MsTeamsIntegrationService } from './services/ms-teams-integration.service';

@Module({
  controllers: [VirtualClassroomController],
  providers: [
    VirtualClassroomService,
    ZoomIntegrationService,
    GoogleMeetIntegrationService,
    MsTeamsIntegrationService,
  ],
  exports: [VirtualClassroomService],
})
export class VirtualClassroomModule {}
