import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, tenantId: string) {
    return this.prisma.client.lesson.create({
      data: {
        ...createLessonDto,
        tenantId,
      },
    });
  }

  async findAll(moduleId: string, tenantId: string) {
    return this.prisma.client.lesson.findMany({
      where: { moduleId, tenantId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const lesson = await this.prisma.client.lesson.findFirst({
      where: { id, tenantId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.client.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.client.lesson.delete({
      where: { id },
    });
  }

  async uploadScorm(data: any, tenantId: string) {
    // Mock implementation
    return { success: true, message: 'SCORM package uploaded successfully', lessonId: 'mock-scorm-id' };
  }
}

