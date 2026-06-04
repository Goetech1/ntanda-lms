import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, tenantId: string, instructorId: string) {
    return this.prisma.client.course.create({
      data: {
        ...createCourseDto,
        tenantId,
        instructorId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.client.course.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        }
      }
    });
  }

  async findOne(id: string, tenantId: string) {
    const course = await this.prisma.client.course.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        modules: {
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { orderIndex: 'asc' }
        }
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, tenantId: string) {
    await this.findOne(id, tenantId); // verify exists

    return this.prisma.client.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId); // verify exists

    return this.prisma.client.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async clone(id: string, tenantId: string, instructorId: string) {
    // Mock implementation
    return { success: true, message: `Course ${id} cloned successfully`, newCourseId: 'mock-cloned-id' };
  }

  async createVersion(id: string, tenantId: string, instructorId: string) {
    // Mock implementation
    return { success: true, message: `New version created for course ${id}`, newVersionId: 'mock-version-id' };
  }
}

