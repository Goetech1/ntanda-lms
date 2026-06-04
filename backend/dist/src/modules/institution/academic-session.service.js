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
exports.AcademicSessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const institution_service_1 = require("./institution.service");
let AcademicSessionService = class AcademicSessionService {
    constructor(prisma, institutionService) {
        this.prisma = prisma;
        this.institutionService = institutionService;
    }
    async create(createDto) {
        const institution = await this.institutionService.getCurrentInstitution();
        if (createDto.isActive) {
            await this.prisma.client.academicSession.updateMany({
                where: { institutionId: institution.id, isActive: true },
                data: { isActive: false },
            });
        }
        return this.prisma.client.academicSession.create({
            data: {
                name: createDto.name,
                startDate: new Date(createDto.startDate),
                endDate: new Date(createDto.endDate),
                isActive: createDto.isActive,
                institutionId: institution.id,
            },
        });
    }
    async findAll() {
        const institution = await this.institutionService.getCurrentInstitution();
        return this.prisma.client.academicSession.findMany({
            where: { institutionId: institution.id },
            orderBy: { startDate: 'desc' },
        });
    }
    async findOne(id) {
        const institution = await this.institutionService.getCurrentInstitution();
        const session = await this.prisma.client.academicSession.findFirst({
            where: { id, institutionId: institution.id },
        });
        if (!session) {
            throw new common_1.NotFoundException('Academic Session not found');
        }
        return session;
    }
    async update(id, updateDto) {
        const session = await this.findOne(id);
        if (updateDto.isActive && !session.isActive) {
            await this.prisma.client.academicSession.updateMany({
                where: { institutionId: session.institutionId, isActive: true, NOT: { id } },
                data: { isActive: false },
            });
        }
        return this.prisma.client.academicSession.update({
            where: { id },
            data: {
                name: updateDto.name,
                startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
                endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
                isActive: updateDto.isActive,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.client.academicSession.delete({
            where: { id },
        });
    }
};
exports.AcademicSessionService = AcademicSessionService;
exports.AcademicSessionService = AcademicSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        institution_service_1.InstitutionService])
], AcademicSessionService);
//# sourceMappingURL=academic-session.service.js.map