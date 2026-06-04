"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
let CertificatesService = class CertificatesService {
    async getCertificates(tenantId, userId) {
        return prisma.certificate.findMany({
            where: { tenantId, userId },
            include: { course: true },
            orderBy: { issuedAt: 'desc' }
        });
    }
    async issueCertificate(tenantId, userId, courseId) {
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                tenantId_userId_courseId: {
                    tenantId,
                    userId,
                    courseId
                }
            }
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.progressPercentage < 100) {
            throw new common_1.BadRequestException('Course is not fully completed yet');
        }
        const existing = await prisma.certificate.findFirst({
            where: { tenantId, userId, courseId }
        });
        if (existing) {
            return existing;
        }
        const validationCode = (0, crypto_1.randomBytes)(8).toString('hex').toUpperCase();
        const certificate = await prisma.certificate.create({
            data: {
                tenantId,
                userId,
                courseId,
                validationCode,
                certificateUrl: `/certificate/verify/${validationCode}`
            },
            include: { course: true }
        });
        return certificate;
    }
    async verifyCertificate(validationCode) {
        const certificate = await prisma.certificate.findUnique({
            where: { validationCode },
            include: {
                user: { select: { fullName: true, email: true } },
                course: { select: { title: true, description: true } },
                tenant: { select: { name: true, branding: true } }
            }
        });
        if (!certificate) {
            throw new common_1.NotFoundException('Certificate not found or invalid');
        }
        return certificate;
    }
    async getCertificatePdf(certificateId) {
        return { success: true, message: 'PDF generated successfully', url: `/downloads/${certificateId}.pdf` };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)()
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map