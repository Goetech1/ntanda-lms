import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InstitutionService } from './institution.service';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly institutionService: InstitutionService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const institution = await this.institutionService.getCurrentInstitution();

    const existing = await this.prisma.client.department.findFirst({
      where: {
        institutionId: institution.id,
        code: createDepartmentDto.code,
      },
    });

    if (existing) {
      throw new ConflictException('A department with this code already exists in your institution');
    }

    return this.prisma.client.department.create({
      data: {
        ...createDepartmentDto,
        institutionId: institution.id,
      },
    });
  }

  async findAll() {
    const institution = await this.institutionService.getCurrentInstitution();
    return this.prisma.client.department.findMany({
      where: { institutionId: institution.id },
    });
  }

  async findOne(id: string) {
    const institution = await this.institutionService.getCurrentInstitution();
    const department = await this.prisma.client.department.findFirst({
      where: { id, institutionId: institution.id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id); // Ensure it exists and belongs to the current institution

    if (updateDepartmentDto.code) {
      const institution = await this.institutionService.getCurrentInstitution();
      const existing = await this.prisma.client.department.findFirst({
        where: {
          institutionId: institution.id,
          code: updateDepartmentDto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('A department with this code already exists in your institution');
      }
    }

    return this.prisma.client.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.client.department.delete({
      where: { id },
    });
  }
}
