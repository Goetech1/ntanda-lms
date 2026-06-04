import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Request } from 'express';
import { JwtPayload, AuthenticatedUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthenticatedUser> {
    const headerTenantId = req.headers['x-tenant-id'] as string;

    // Enforce tenant boundary: JWT tenant_id must match the request header (if provided)
    if (headerTenantId && payload.tenant_id && headerTenantId !== payload.tenant_id) {
      throw new UnauthorizedException({ message: 'Tenant mismatch', errorCode: 'AUTH_005' });
    }

    // Verify the user still exists in the DB
    const user = await this.prisma.client.user.findFirst({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException({ message: 'User not found', errorCode: 'AUTH_001' });
    }

    const tenantId = user.tenantId;

    // Attach tenantId directly on request so controllers can use req.tenantId
    (req as any).tenantId = tenantId;

    // Use role and permissions from the JWT payload (already validated via secret)
    return {
      id: user.id,
      email: user.email,
      role: payload.role,
      permissions: payload.permissions ?? [],
      tenantId,
    };
  }
}
