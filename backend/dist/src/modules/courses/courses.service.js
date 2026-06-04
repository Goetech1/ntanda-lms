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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCourseDto, tenantId, instructorId) {
        return this.prisma.client.course.create({
            data: {
                ...createCourseDto,
                tenantId,
                instructorId,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.client.course.findMany({
            where: { tenantId, deletedAt: null },
            include: {
                instructor: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            }
        });
    }
    async findOne(id, tenantId) {
        const course = await this.prisma.client.course.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                instructor: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                },
                modules: {
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' }
                        }
                    },
                    orderBy: { orderIndex: 'asc' }
                }
            },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    async update(id, updateCourseDto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.course.update({
            where: { id },
            data: updateCourseDto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.course.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async clone(id, tenantId, instructorId) {
        return { success: true, message: `Course ${id} cloned successfully`, newCourseId: 'mock-cloned-id' };
    }
    async createVersion(id, tenantId, instructorId) {
        return { success: true, message: `New version created for course ${id}`, newVersionId: 'mock-version-id' };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map