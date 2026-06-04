import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class CourseCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, tenantId: string) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.client.courseCategory.create({
      data: { tenantId, name: dto.name, slug, description: dto.description },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.client.courseCategory.findMany({
      where: { tenantId },
      include: { _count: { select: { courses: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const cat = await this.prisma.client.courseCategory.findFirst({
      where: { id, tenantId },
      include: { courses: { where: { deletedAt: null }, select: { id: true, title: true, status: true } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: string, dto: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.client.courseCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.client.courseCategory.delete({ where: { id } });
  }
}
