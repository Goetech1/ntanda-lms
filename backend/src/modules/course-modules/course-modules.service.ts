import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

@Injectable()
export class CourseModulesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseModuleDto: CreateCourseModuleDto, tenantId: string) {
    return this.prisma.client.courseModule.create({
      data: {
        ...createCourseModuleDto,
        tenantId,
      },
    });
  }

  async findAll(courseId: string, tenantId: string) {
    return this.prisma.client.courseModule.findMany({
      where: { courseId, tenantId },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const courseModule = await this.prisma.client.courseModule.findFirst({
      where: { id, tenantId },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      },
    });

    if (!courseModule) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return courseModule;
  }

  async update(id: string, updateCourseModuleDto: UpdateCourseModuleDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.client.courseModule.update({
      where: { id },
      data: updateCourseModuleDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.client.courseModule.delete({
      where: { id },
    });
  }
}
