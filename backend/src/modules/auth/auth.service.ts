import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, tenantId: string) {
    const { email, password } = loginDto;
    
    // We pass tenantId from context in interceptors, but if not available we can just find by email
    const user = await this.prisma.client.user.findFirst({ 
      where: { 
        email,
        ...(tenantId ? { tenantId } : {})
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });
    
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials', errorCode: 'AUTH_001' });
    }

    const isValidPassword = await argon2.verify(user.passwordHash, password).catch(() => false);
    if (!isValidPassword) {
      throw new UnauthorizedException({ message: 'Invalid credentials', errorCode: 'AUTH_001' });
    }

    // Generate tokens
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role.name, 
      permissions: user.role.permissions.map(p => `${p.action}_${p.resource}`),
      tenant_id: user.tenantId 
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(64).toString('hex');

    // Store refresh token
    await this.prisma.client.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        role: user.role.name,
        full_name: user.fullName,
      }
    };
  }

  async register(registerDto: RegisterDto, tenantId: string) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.client.user.findFirst({ 
      where: { 
        email,
        ...(tenantId ? { tenantId } : {})
      } 
    });
    
    if (existingUser) {
      throw new ConflictException({ message: 'Email already exists', errorCode: 'AUTH_003' });
    }

    const passwordHash = await argon2.hash(password);

    const studentRole = await this.prisma.client.role.findFirst({
      where: { name: 'STUDENT', OR: [{ tenantId }, { isSystem: true }] }
    });
    if (!studentRole) {
      throw new ConflictException('Default STUDENT role not found in system.');
    }

    const user = await this.prisma.client.user.create({
      data: {
        tenantId,
        email,
        passwordHash,
        fullName: `${firstName} ${lastName}`,
        roleId: studentRole.id,
      },
      include: {
        role: true,
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      }
    };
  }

  async refreshWithUserId(userId: string, incomingToken: string) {
    const userTokens = await this.prisma.client.refreshToken.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } }
    });

    let validTokenId = null;
    for (const rt of userTokens) {
      const isValid = await argon2.verify(rt.tokenHash, incomingToken).catch(() => false);
      if (isValid) {
        validTokenId = rt.id;
        break;
      }
    }

    if (!validTokenId) {
      throw new UnauthorizedException({ message: 'Invalid refresh token', errorCode: 'AUTH_004' });
    }

    // Revoke old token
    await this.prisma.client.refreshToken.update({
      where: { id: validTokenId },
      data: { isRevoked: true }
    });

    const user = await this.prisma.client.user.findUnique({ 
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });
    if (!user) throw new UnauthorizedException();

    // Generate new tokens
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role.name, 
      permissions: user.role.permissions.map(p => `${p.action}_${p.resource}`),
      tenant_id: user.tenantId 
    };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = randomBytes(64).toString('hex');

    await this.prisma.client.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const userTokens = await this.prisma.client.refreshToken.findMany({
        where: { userId, isRevoked: false }
      });
      for (const rt of userTokens) {
        const isValid = await argon2.verify(rt.tokenHash, refreshToken).catch(() => false);
        if (isValid) {
          await this.prisma.client.refreshToken.update({
            where: { id: rt.id },
            data: { isRevoked: true }
          });
          break;
        }
      }
    } else {
      // Revoke all tokens for user
      await this.prisma.client.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true }
      });
    }
  }

  async ssoLogin(provider: string, data: any, tenantId: string) {
    // Mock implementation for SSO
    return { success: true, message: `${provider} login successful`, token: 'mock-sso-token' };
  }

  async enable2FA(userId: string) {
    // Mock implementation
    return { success: true, message: '2FA enabled', secret: 'mock-secret' };
  }

  async getDevices(userId: string) {
    // Mock implementation
    return { success: true, data: [{ id: 'device-1', name: 'Browser' }] };
  }
}

