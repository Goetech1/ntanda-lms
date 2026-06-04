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
exports.AcademicRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let AcademicRecordsService = class AcademicRecordsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentTranscript(userId, tenantId) {
        const enrollments = await this.prisma.client.enrollment.findMany({
            where: { userId, tenantId },
            include: {
                course: { select: { title: true, id: true } }
            }
        });
        const submissions = await this.prisma.client.submission.findMany({
            where: { userId, tenantId },
            include: {
                assessment: { select: { title: true, totalPoints: true, courseId: true } }
            }
        });
        let totalScore = 0;
        let totalPossible = 0;
        submissions.forEach(sub => {
            if (sub.score !== null) {
                totalScore += sub.score;
                totalPossible += sub.assessment.totalPoints;
            }
        });
        const gpaPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
        const calculatedGpa = (gpaPercentage / 100) * 4.0;
        await this.prisma.client.studentProfile.updateMany({
            where: { userId, tenantId },
            data: { gpa: calculatedGpa }
        });
        return {
            enrollments,
            submissions,
            gpa: calculatedGpa.toFixed(2),
        };
    }
};
exports.AcademicRecordsService = AcademicRecordsService;
exports.AcademicRecordsService = AcademicRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicRecordsService);
//# sourceMappingURL=academic-records.service.js.map