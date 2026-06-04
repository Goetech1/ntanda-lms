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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let AssessmentsService = class AssessmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        return this.prisma.client.assessment.create({
            data: {
                tenantId,
                courseId: dto.courseId,
                title: dto.title,
                type: dto.type,
                timeLimitMinutes: dto.timeLimitMinutes,
                totalPoints: dto.totalPoints || 0,
            },
        });
    }
    async findByCourse(courseId, tenantId) {
        return this.prisma.client.assessment.findMany({
            where: { courseId, tenantId, deletedAt: null },
            include: { _count: { select: { questions: true, submissions: true } } },
        });
    }
    async findOne(id, tenantId) {
        const assessment = await this.prisma.client.assessment.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                questions: { orderBy: { orderIndex: 'asc' } },
                _count: { select: { submissions: true } },
            },
        });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
        return assessment;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.assessment.update({ where: { id }, data: dto });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.client.assessment.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async addQuestion(assessmentId, dto, tenantId) {
        const assessment = await this.findOne(assessmentId, tenantId);
        const count = await this.prisma.client.question.count({ where: { assessmentId } });
        const question = await this.prisma.client.question.create({
            data: {
                tenantId,
                assessmentId,
                content: dto.content,
                options: dto.options,
                correctAnswer: dto.correctAnswer,
                points: dto.points || 1,
                orderIndex: count + 1,
            },
        });
        const total = await this.prisma.client.question.aggregate({
            where: { assessmentId },
            _sum: { points: true },
        });
        await this.prisma.client.assessment.update({
            where: { id: assessmentId },
            data: { totalPoints: total._sum.points || 0 },
        });
        return question;
    }
    async updateQuestion(questionId, dto, tenantId) {
        const question = await this.prisma.client.question.findFirst({ where: { id: questionId, tenantId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return this.prisma.client.question.update({ where: { id: questionId }, data: dto });
    }
    async deleteQuestion(questionId, tenantId) {
        const question = await this.prisma.client.question.findFirst({ where: { id: questionId, tenantId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return this.prisma.client.question.delete({ where: { id: questionId } });
    }
    async getRandomizedQuiz(assessmentId, tenantId) {
        const assessment = await this.findOne(assessmentId, tenantId);
        const questions = [...assessment.questions];
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        return {
            ...assessment,
            questions: questions.map(({ correctAnswer, ...q }) => q),
        };
    }
    async submit(assessmentId, userId, answers, tenantId) {
        const assessment = await this.findOne(assessmentId, tenantId);
        const questions = assessment.questions;
        let score = 0;
        for (const question of questions) {
            const userAnswer = answers[question.id];
            const correct = question.correctAnswer;
            if (JSON.stringify(userAnswer) === JSON.stringify(correct)) {
                score += question.points;
            }
        }
        const submission = await this.prisma.client.submission.create({
            data: {
                tenantId,
                assessmentId,
                userId,
                answers,
                score,
                status: 'GRADED',
            },
        });
        return { submission, score, totalPoints: assessment.totalPoints, percentage: ((score / assessment.totalPoints) * 100).toFixed(1) };
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map