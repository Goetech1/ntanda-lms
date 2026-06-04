"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ExamsService = class ExamsService {
    async scheduleExam(tenantId, courseId, title, scheduledAt, durationMinutes, requireWebcam, secureBrowser) {
        return prisma.exam.create({
            data: {
                tenantId,
                courseId,
                title,
                scheduledAt: new Date(scheduledAt),
                durationMinutes,
                requireWebcam,
                secureBrowser,
            }
        });
    }
    async getExams(tenantId, courseId) {
        return prisma.exam.findMany({
            where: { tenantId, courseId },
            orderBy: { scheduledAt: 'asc' }
        });
    }
    async startAttempt(tenantId, userId, examId) {
        const exam = await prisma.exam.findUnique({
            where: { id: examId, tenantId }
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exam not found');
        }
        if (exam.scheduledAt && new Date() < exam.scheduledAt) {
            throw new common_1.BadRequestException('Exam has not started yet');
        }
        const existing = await prisma.examAttempt.findFirst({
            where: { tenantId, examId, userId, completedAt: null }
        });
        if (existing) {
            return existing;
        }
        return prisma.examAttempt.create({
            data: {
                tenantId,
                examId,
                userId,
            }
        });
    }
    async reportAntiCheat(tenantId, userId, attemptId, flags) {
        const attempt = await prisma.examAttempt.findUnique({
            where: { id: attemptId, tenantId, userId }
        });
        if (!attempt) {
            throw new common_1.NotFoundException('Attempt not found');
        }
        if (attempt.completedAt) {
            throw new common_1.BadRequestException('Exam already completed');
        }
        const existingFlags = attempt.antiCheatFlags || [];
        existingFlags.push({ timestamp: new Date(), ...flags });
        return prisma.examAttempt.update({
            where: { id: attemptId },
            data: { antiCheatFlags: existingFlags }
        });
    }
    async submitExam(tenantId, userId, attemptId, score) {
        const attempt = await prisma.examAttempt.findUnique({
            where: { id: attemptId, tenantId, userId }
        });
        if (!attempt) {
            throw new common_1.NotFoundException('Attempt not found');
        }
        if (attempt.completedAt) {
            throw new common_1.BadRequestException('Exam already completed');
        }
        return prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                completedAt: new Date(),
                score
            }
        });
    }
    async monitorExam(tenantId, userId, examId) {
        return { success: true, message: 'Webcam monitoring started', examId };
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)()
], ExamsService);
//# sourceMappingURL=exams.service.js.map