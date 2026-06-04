"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto, tenantId) {
        const { email, password } = loginDto;
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
            throw new common_1.UnauthorizedException({ message: 'Invalid credentials', errorCode: 'AUTH_001' });
        }
        const isValidPassword = await argon2.verify(user.passwordHash, password).catch(() => false);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException({ message: 'Invalid credentials', errorCode: 'AUTH_001' });
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
            permissions: user.role.permissions.map(p => `${p.action}_${p.resource}`),
            tenant_id: user.tenantId
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        await this.prisma.client.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: await argon2.hash(refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    async register(registerDto, tenantId) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.prisma.client.user.findFirst({
            where: {
                email,
                ...(tenantId ? { tenantId } : {})
            }
        });
        if (existingUser) {
            throw new common_1.ConflictException({ message: 'Email already exists', errorCode: 'AUTH_003' });
        }
        const passwordHash = await argon2.hash(password);
        const studentRole = await this.prisma.client.role.findFirst({
            where: { name: 'STUDENT', OR: [{ tenantId }, { isSystem: true }] }
        });
        if (!studentRole) {
            throw new common_1.ConflictException('Default STUDENT role not found in system.');
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
    async refreshWithUserId(userId, incomingToken) {
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
            throw new common_1.UnauthorizedException({ message: 'Invalid refresh token', errorCode: 'AUTH_004' });
        }
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
        if (!user)
            throw new common_1.UnauthorizedException();
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
            permissions: user.role.permissions.map(p => `${p.action}_${p.resource}`),
            tenant_id: user.tenantId
        };
        const accessToken = this.jwtService.sign(payload);
        const newRefreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        await this.prisma.client.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: await argon2.hash(newRefreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        });
        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
        };
    }
    async logout(userId, refreshToken) {
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
        }
        else {
            await this.prisma.client.refreshToken.updateMany({
                where: { userId, isRevoked: false },
                data: { isRevoked: true }
            });
        }
    }
    async ssoLogin(provider, data, tenantId) {
        return { success: true, message: `${provider} login successful`, token: 'mock-sso-token' };
    }
    async enable2FA(userId) {
        return { success: true, message: '2FA enabled', secret: 'mock-secret' };
    }
    async getDevices(userId) {
        return { success: true, data: [{ id: 'device-1', name: 'Browser' }] };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map