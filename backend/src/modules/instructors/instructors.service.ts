import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class InstructorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, tenantId: string) {
    const existing = await this.prisma.client.user.findFirst({
      where: { email: dto.email, tenantId },
    });
    if (existing) throw new ConflictException('User with this email already exists');

    const instructorRole = await this.prisma.client.role.findFirst({
      where: { name: 'instructor', tenantId: null },
    });
    if (!instructorRole) throw new NotFoundException('Instructor role not found');

    const passwordHash = await argon2.hash(dto.password || 'password123');

    const user = await this.prisma.client.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        roleId: instructorRole.id,
        instructorProfile: {
          create: {
            tenantId,
            bio: dto.bio,
            expertise: dto.expertise || [],
            qualifications: dto.qualifications || [],
            teachingSubjects: dto.teachingSubjects || [],
          },
        },
      },
      include: { instructorProfile: true, role: true },
    });

    const { passwordHash: _ph, ...safe } = user;
    return safe;
  }

  async findAll(tenantId: string) {
    const instructorRole = await this.prisma.client.role.findFirst({
      where: { name: 'instructor', tenantId: null },
    });

    const users = await this.prisma.client.user.findMany({
      where: { tenantId, roleId: instructorRole?.id, deletedAt: null },
      include: {
        instructorProfile: true,
        courses: {
          where: { deletedAt: null },
          select: { id: true, title: true, status: true, _count: { select: { enrollments: true } } },
        },
      },
    });

    return users.map((u) => {
      const { passwordHash: _ph, ...safe } = u;
      return safe;
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id, tenantId },
      include: {
        instructorProfile: true,
        courses: {
          where: { deletedAt: null },
          include: { _count: { select: { enrollments: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('Instructor not found');
    const { passwordHash: _ph, ...safe } = user;
    return safe;
  }

  async update(id: string, dto: any, tenantId: string) {
    await this.findOne(id, tenantId);
    const updated = await this.prisma.client.user.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        instructorProfile: {
          upsert: {
            create: { tenantId, bio: dto.bio, expertise: dto.expertise || [], qualifications: dto.qualifications || [], teachingSubjects: dto.teachingSubjects || [] },
            update: { bio: dto.bio, expertise: dto.expertise, qualifications: dto.qualifications, teachingSubjects: dto.teachingSubjects },
          },
        },
      },
      include: { instructorProfile: true },
    });
    const { passwordHash: _ph, ...safe } = updated;
    return safe;
  }

  async getPerformance(id: string, tenantId: string) {
    const instructor = await this.findOne(id, tenantId);
    const courses = instructor.courses as any[];

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c: any) => c.status === 'PUBLISHED').length;
    const totalStudents = courses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0);

    const submissions = await this.prisma.client.submission.findMany({
      where: { tenantId, assessment: { course: { instructorId: id } } },
      select: { score: true, assessment: { select: { totalPoints: true } } },
    });

    const avgScore = submissions.length > 0
      ? submissions.reduce((sum, s) => sum + ((s.score || 0) / s.assessment.totalPoints) * 100, 0) / submissions.length
      : 0;

    return { totalCourses, publishedCourses, totalStudents, avgScore: avgScore.toFixed(1) };
  }
}
