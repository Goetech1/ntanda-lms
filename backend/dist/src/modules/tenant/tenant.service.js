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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let TenantService = class TenantService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTenantDto) {
        const existingTenant = await this.prisma.client.tenant.findFirst({
            where: {
                OR: [
                    { domain: createTenantDto.domain },
                    { subdomain: createTenantDto.subdomain },
                ],
            },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('A tenant with this domain or subdomain already exists');
        }
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
    async findOne(id) {
        const tenant = await this.prisma.client.tenant.findUnique({
            where: { id },
        });
        if (!tenant || tenant.deletedAt) {
            throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        await this.findOne(id);
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
                throw new common_1.ConflictException('A tenant with this domain or subdomain already exists');
            }
        }
        return this.prisma.client.tenant.update({
            where: { id },
            data: updateTenantDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.client.tenant.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map