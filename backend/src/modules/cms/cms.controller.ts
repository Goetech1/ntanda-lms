import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('pages')
  async getPages(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    return this.cmsService.getPages(tenantId);
  }

  @Post('blogs')
  async createBlog(@Req() req: any, @Body() data: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    return this.cmsService.createBlog(tenantId, data);
  }

  @Post('leads')
  async captureLead(@Req() req: any, @Body() data: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    return this.cmsService.captureLead(tenantId, data);
  }
}
