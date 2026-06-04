import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const existingTenant = await this.prisma.client.tenant.findFirst({
      where: {
        OR: [
          { domain: createTenantDto.domain },
          { subdomain: createTenantDto.subdomain },
        ],
      },
    });

    if (existingTenant) {
      throw new ConflictException('A tenant with this domain or subdomain already exists');
    }

    // Creating tenant directly using the client
    return this.prisma.client.tenant.create({
      data: createTenantDto,
    });
  }

  async findAll() {
    return this.prisma.client.tenant.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.client.tenant.findUnique({
      where: { id },
    });

    if (!tenant || tenant.deletedAt) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    await this.findOne(id); // Check existence

    if (updateTenantDto.domain || updateTenantDto.subdomain) {
      const existingTenant = await this.prisma.client.tenant.findFirst({
        where: {
          OR: [
            { domain: updateTenantDto.domain },
            { subdomain: updateTenantDto.subdomain },
          ],
          NOT: { id },
        },
      });

      if (existingTenant) {
        throw new ConflictException('A tenant with this domain or subdomain already exists');
      }
    }

    return this.prisma.client.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence

    return this.prisma.client.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
