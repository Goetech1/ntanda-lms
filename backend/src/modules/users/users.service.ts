import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, tenantId: string) {
    const existing = await this.prisma.client.user.findFirst({
      where: { email: createUserDto.email, tenantId },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists in the tenant');
    }

    const passwordHash = await argon2.hash(createUserDto.password);

    const user = await this.prisma.client.user.create({
      data: {
        tenantId,
        email: createUserDto.email,
        passwordHash,
        fullName: createUserDto.fullName,
        roleId: createUserDto.roleId,
        avatarUrl: createUserDto.avatarUrl,
      },
      include: {
        role: true,
      },
    });

    // Don't return password hash
    const { passwordHash: _hash, ...result } = user;
    return result;
  }

  async findAll(tenantId: string) {
    const users = await this.prisma.client.user.findMany({
      where: { tenantId },
      include: {
        role: true,
      },
    });
    
    return users.map(u => {
      const { passwordHash: _hash, ...result } = u;
      return result;
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id, tenantId },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash: _hash1, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string) {
    await this.findOne(id, tenantId); // ensure exists
    
    const data: any = { ...updateUserDto };
    
    if (data.password) {
      data.passwordHash = await argon2.hash(data.password);
      delete data.password;
    }

    const user = await this.prisma.client.user.update({
      where: { id },
      data,
      include: {
        role: true,
      },
    });

    const { passwordHash: _hash2, ...result } = user;
    return result;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    
    await this.prisma.client.user.delete({
      where: { id },
    });
    
    return { success: true };
  }
}
