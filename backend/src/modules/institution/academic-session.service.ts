import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';
import { InstitutionService } from './institution.service';

@Injectable()
export class AcademicSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly institutionService: InstitutionService,
  ) {}

  async create(createDto: CreateAcademicSessionDto) {
    const institution = await this.institutionService.getCurrentInstitution();

    // If making active, deactivate others
    if (createDto.isActive) {
      await this.prisma.client.academicSession.updateMany({
        where: { institutionId: institution.id, isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.client.academicSession.create({
      data: {
        name: createDto.name,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        isActive: createDto.isActive,
        institutionId: institution.id,
      },
    });
  }

  async findAll() {
    const institution = await this.institutionService.getCurrentInstitution();
    return this.prisma.client.academicSession.findMany({
      where: { institutionId: institution.id },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const institution = await this.institutionService.getCurrentInstitution();
    const session = await this.prisma.client.academicSession.findFirst({
      where: { id, institutionId: institution.id },
    });

    if (!session) {
      throw new NotFoundException('Academic Session not found');
    }

    return session;
  }

  async update(id: string, updateDto: UpdateAcademicSessionDto) {
    const session = await this.findOne(id);

    if (updateDto.isActive && !session.isActive) {
      await this.prisma.client.academicSession.updateMany({
        where: { institutionId: session.institutionId, isActive: true, NOT: { id } },
        data: { isActive: false },
      });
    }

    return this.prisma.client.academicSession.update({
      where: { id },
      data: {
        name: updateDto.name,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        isActive: updateDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.academicSession.delete({
      where: { id },
    });
  }
}
