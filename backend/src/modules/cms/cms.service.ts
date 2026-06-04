import { Injectable } from '@nestjs/common';

@Injectable()
export class CmsService {
  async getPages(tenantId: string) {
    // Mock implementation
    return { success: true, data: [{ id: 'page-1', title: 'Home' }] };
  }

  async createBlog(tenantId: string, blogData: any) {
    // Mock implementation
    return { success: true, data: { id: 'blog-1', ...blogData } };
  }

  async captureLead(tenantId: string, leadData: any) {
    // Mock implementation
    return { success: true, message: 'Lead captured successfully' };
  }
}
