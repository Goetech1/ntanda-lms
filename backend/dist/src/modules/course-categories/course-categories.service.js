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
exports.CourseCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let CourseCategoriesService = class CourseCategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const slug = dto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.client.courseCategory.create({
            data: { tenantId, name: dto.name, slug, description: dto.description },
        });
    }
    async findAll(tenantId) {
        return this.prisma.client.courseCategory.findMany({
            where: { tenantId },
            include: { _count: { select: { courses: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const cat = await this.prisma.client.courseCategory.findFirst({
            where: { id, tenantId },
            include: { courses: { where: { deletedAt: null }, select: { id: true, title: true, status: true } } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.courseCategory.update({ where: { id }, data: dto });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.courseCategory.delete({ where: { id } });
    }
};
exports.CourseCategoriesService = CourseCategoriesService;
exports.CourseCategoriesService = CourseCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseCategoriesService);
//# sourceMappingURL=course-categories.service.js.map