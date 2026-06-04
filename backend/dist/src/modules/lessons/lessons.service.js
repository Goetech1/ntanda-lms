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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLessonDto, tenantId) {
        return this.prisma.client.lesson.create({
            data: {
                ...createLessonDto,
                tenantId,
            },
        });
    }
    async findAll(moduleId, tenantId) {
        return this.prisma.client.lesson.findMany({
            where: { moduleId, tenantId },
            orderBy: { orderIndex: 'asc' },
        });
    }
    async findOne(id, tenantId) {
        const lesson = await this.prisma.client.lesson.findFirst({
            where: { id, tenantId },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async update(id, updateLessonDto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.lesson.update({
            where: { id },
            data: updateLessonDto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.lesson.delete({
            where: { id },
        });
    }
    async uploadScorm(data, tenantId) {
        return { success: true, message: 'SCORM package uploaded successfully', lessonId: 'mock-scorm-id' };
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map