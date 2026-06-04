import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('ebooks')
  async getEbooks(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    return this.libraryService.getEbooks(tenantId);
  }

  @Post('borrow')
  async borrowItem(@Req() req: any, @Body() data: any) {
    const tenantId = req.user?.tenantId || 'default-tenant-id';
    const userId = req.user?.id || 'default-user-id';
    return this.libraryService.borrowItem(tenantId, userId, data);
  }
}
