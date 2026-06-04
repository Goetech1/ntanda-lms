import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { tenantStorage } from '../../app.module';

@Injectable()
export class InstitutionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentInstitution() {
    const tenantId = tenantStorage.getStore();
    
    let institution = await this.prisma.client.institution.findUnique({
      where: { tenantId },
    });

    if (!institution && tenantId) {
      // Auto-create institution if it doesn't exist for the tenant
      const tenant = await this.prisma.client.tenant.findUnique({ where: { id: tenantId } });
      if (tenant) {
        institution = await this.prisma.client.institution.create({
          data: {
            tenantId,
            name: tenant.name,
          },
        });
      }
    }

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return institution;
  }

  async updateCurrentInstitution(updateDto: UpdateInstitutionDto) {
    const tenantId = tenantStorage.getStore();
    
    // Ensure it exists first
    await this.getCurrentInstitution();

    return this.prisma.client.institution.update({
      where: { tenantId },
      data: updateDto,
    });
  }
}
