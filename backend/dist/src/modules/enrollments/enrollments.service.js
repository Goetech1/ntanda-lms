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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEnrollmentDto, tenantId, userId) {
        const existing = await this.prisma.client.enrollment.findUnique({
            where: {
                tenantId_userId_courseId: {
                    tenantId,
                    userId,
                    courseId: createEnrollmentDto.courseId,
                }
            }
        });
        if (existing) {
            throw new common_1.ConflictException('User is already enrolled in this course');
        }
        return this.prisma.client.enrollment.create({
            data: {
                tenantId,
                userId,
                courseId: createEnrollmentDto.courseId,
                progressPercentage: 0,
            },
        });
    }
    async findAllByUser(userId, tenantId) {
        return this.prisma.client.enrollment.findMany({
            where: { userId, tenantId },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: { id: true, fullName: true }
                        }
                    }
                }
            }
        });
    }
    async findAllByCourse(courseId, tenantId) {
        return this.prisma.client.enrollment.findMany({
            where: { courseId, tenantId },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true }
                }
            }
        });
    }
    async updateProgress(id, progressPercentage, tenantId) {
        const enrollment = await this.prisma.client.enrollment.findFirst({
            where: { id, tenantId },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment with ID ${id} not found`);
        }
        return this.prisma.client.enrollment.update({
            where: { id },
            data: {
                progressPercentage,
                completedAt: progressPercentage === 100 ? new Date() : null,
            },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map