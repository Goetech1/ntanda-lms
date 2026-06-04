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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRoleDto, tenantId) {
        const existing = await this.prisma.client.role.findFirst({
            where: { name: createRoleDto.name, tenantId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Role with name ${createRoleDto.name} already exists in this tenant`);
        }
        return this.prisma.client.role.create({
            data: {
                ...createRoleDto,
                tenantId,
                isSystem: false,
            },
        });
    }
    async findAll(tenantId) {
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
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    async update(id, updateRoleDto, tenantId) {
        const role = await this.findOne(id, tenantId);
        if (role.isSystem) {
            throw new common_1.ForbiddenException('Cannot modify a system role');
        }
        return this.prisma.client.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }
    async remove(id, tenantId) {
        const role = await this.findOne(id, tenantId);
        if (role.isSystem) {
            throw new common_1.ForbiddenException('Cannot delete a system role');
        }
        await this.prisma.client.role.delete({
            where: { id },
        });
        return { success: true };
    }
    async assignPermissions(id, permissionIds, tenantId) {
        const role = await this.findOne(id, tenantId);
        if (role.isSystem) {
            throw new common_1.ForbiddenException('Cannot modify permissions of a system role');
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
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map