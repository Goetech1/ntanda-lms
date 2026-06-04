import { Controller, Post, Body, Param, Get, Req, UseGuards } from '@nestjs/common';
import { VirtualClassroomService } from './virtual-classroom.service';

@Controller('virtual-classrooms')
export class VirtualClassroomController {
  constructor(private readonly virtualClassroomService: VirtualClassroomService) {}

  @Post('schedule')
  async scheduleClass(@Req() req: any, @Body() data: any) {
    // Basic scaffold
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    const instructorId = req.user?.id || 'default-instructor-id';
    return this.virtualClassroomService.scheduleClass(tenantId, instructorId, data);
  }

  @Get()
  async listClasses(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    return this.virtualClassroomService.listClasses(tenantId);
  }

  @Post(':id/register')
  async register(@Param('id') id: string, @Req() req: any, @Body() data: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    const userId = req.user?.id;
    return this.virtualClassroomService.registerForWebinar(tenantId, id, data.email, data.fullName, userId);
  }
}
