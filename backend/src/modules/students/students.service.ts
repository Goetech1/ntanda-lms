import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: any, tenantId: string) {
    const existing = await this.prisma.client.user.findFirst({
      where: { email: createStudentDto.email, tenantId },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists in your institution');
    }

    const studentRole = await this.prisma.client.role.findFirst({
      where: { name: 'student', tenantId: null },
    });

    if (!studentRole) {
      throw new NotFoundException('System student role not found');
    }

    const passwordHash = await argon2.hash(createStudentDto.password || 'password123');

    return this.prisma.client.user.create({
      data: {
        tenantId,
        email: createStudentDto.email,
        passwordHash,
        fullName: createStudentDto.fullName,
        roleId: studentRole.id,
        studentProfile: {
          create: {
            tenantId,
            studentIdString: createStudentDto.studentIdString,
            dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : null,
            address: createStudentDto.address,
            emergencyContact: createStudentDto.emergencyContact || {},
          }
        }
      },
      include: {
        studentProfile: true,
      }
    });
  }

  async findAll(tenantId: string) {
    const studentRole = await this.prisma.client.role.findFirst({
      where: { name: 'student', tenantId: null },
    });

    const users = await this.prisma.client.user.findMany({
      where: { tenantId, roleId: studentRole?.id },
      include: {
        studentProfile: true,
      },
    });

    return users.map(u => {
      const { passwordHash, ...safeUser } = u;
      return safeUser;
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id, tenantId },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, updateStudentDto: any, tenantId: string) {
    const user = await this.findOne(id, tenantId);

    const dataToUpdate: any = {
      fullName: updateStudentDto.fullName,
    };

    let profileUpdate: any = undefined;
    if (updateStudentDto.studentIdString || updateStudentDto.dateOfBirth || updateStudentDto.address || updateStudentDto.emergencyContact) {
      profileUpdate = {
        upsert: {
          create: {
            tenantId,
            studentIdString: updateStudentDto.studentIdString,
            dateOfBirth: updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : null,
            address: updateStudentDto.address,
            emergencyContact: updateStudentDto.emergencyContact,
          },
          update: {
            studentIdString: updateStudentDto.studentIdString,
            dateOfBirth: updateStudentDto.dateOfBirth ? new Date(updateStudentDto.dateOfBirth) : undefined,
            address: updateStudentDto.address,
            emergencyContact: updateStudentDto.emergencyContact,
          }
        }
      };
      dataToUpdate.studentProfile = profileUpdate;
    }

    const updated = await this.prisma.client.user.update({
      where: { id },
      data: dataToUpdate,
      include: {
        studentProfile: true,
      }
    });

    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }
}
