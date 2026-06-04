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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const argon2 = require("argon2");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto, tenantId) {
        const existing = await this.prisma.client.user.findFirst({
            where: { email: createUserDto.email, tenantId },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists in the tenant');
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
        const { passwordHash: _hash, ...result } = user;
        return result;
    }
    async findAll(tenantId) {
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
    async findOne(id, tenantId) {
        const user = await this.prisma.client.user.findFirst({
            where: { id, tenantId },
            include: {
                role: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { passwordHash: _hash1, ...result } = user;
        return result;
    }
    async update(id, updateUserDto, tenantId) {
        await this.findOne(id, tenantId);
        const data = { ...updateUserDto };
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
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.client.user.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map