import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto, tenantId: string) {
    const existing = await this.prisma.client.role.findFirst({
      where: { name: createRoleDto.name, tenantId },
    });

    if (existing) {
      throw new ConflictException(`Role with name ${createRoleDto.name} already exists in this tenant`);
    }

    return this.prisma.client.role.create({
      data: {
        ...createRoleDto,
        tenantId,
        isSystem: false,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.client.role.findMany({
      where: { 
        OR: [
          { tenantId },
          { isSystem: true }
        ]
      },
      include: {
        permissions: true,
      }
    });
  }

  async findOne(id: string, tenantId: string) {
    const role = await this.prisma.client.role.findFirst({
      where: { 
        id,
        OR: [
          { tenantId },
          { isSystem: true }
        ]
      },
      include: {
        permissions: true,
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, tenantId: string) {
    const role = await this.findOne(id, tenantId);
    
    if (role.isSystem) {
      throw new ForbiddenException('Cannot modify a system role');
    }

    return this.prisma.client.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: string, tenantId: string) {
    const role = await this.findOne(id, tenantId);
    
    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete a system role');
    }

    await this.prisma.client.role.delete({
      where: { id },
    });
    
    return { success: true };
  }

  async assignPermissions(id: string, permissionIds: string[], tenantId: string) {
    const role = await this.findOne(id, tenantId);
    
    if (role.isSystem) {
      throw new ForbiddenException('Cannot modify permissions of a system role');
    }

    return this.prisma.client.role.update({
      where: { id },
      data: {
        permissions: {
          set: permissionIds.map(pid => ({ id: pid })),
        }
      },
      include: {
        permissions: true,
      }
    });
  }
}
