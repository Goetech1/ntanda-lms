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
exports.CourseModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let CourseModulesService = class CourseModulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCourseModuleDto, tenantId) {
        return this.prisma.client.courseModule.create({
            data: {
                ...createCourseModuleDto,
                tenantId,
            },
        });
    }
    async findAll(courseId, tenantId) {
        return this.prisma.client.courseModule.findMany({
            where: { courseId, tenantId },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' }
                }
            },
            orderBy: { orderIndex: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const courseModule = await this.prisma.client.courseModule.findFirst({
            where: { id, tenantId },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' }
                }
            },
        });
        if (!courseModule) {
            throw new common_1.NotFoundException(`Module with ID ${id} not found`);
        }
        return courseModule;
    }
    async update(id, updateCourseModuleDto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.courseModule.update({
            where: { id },
            data: updateCourseModuleDto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.courseModule.delete({
            where: { id },
        });
    }
};
exports.CourseModulesService = CourseModulesService;
exports.CourseModulesService = CourseModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseModulesService);
//# sourceMappingURL=course-modules.service.js.map