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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const institution_service_1 = require("./institution.service");
let DepartmentService = class DepartmentService {
    constructor(prisma, institutionService) {
        this.prisma = prisma;
        this.institutionService = institutionService;
    }
    async create(createDepartmentDto) {
        const institution = await this.institutionService.getCurrentInstitution();
        const existing = await this.prisma.client.department.findFirst({
            where: {
                institutionId: institution.id,
                code: createDepartmentDto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('A department with this code already exists in your institution');
        }
        return this.prisma.client.department.create({
            data: {
                ...createDepartmentDto,
                institutionId: institution.id,
            },
        });
    }
    async findAll() {
        const institution = await this.institutionService.getCurrentInstitution();
        return this.prisma.client.department.findMany({
            where: { institutionId: institution.id },
        });
    }
    async findOne(id) {
        const institution = await this.institutionService.getCurrentInstitution();
        const department = await this.prisma.client.department.findFirst({
            where: { id, institutionId: institution.id },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        await this.findOne(id);
        if (updateDepartmentDto.code) {
            const institution = await this.institutionService.getCurrentInstitution();
            const existing = await this.prisma.client.department.findFirst({
                where: {
                    institutionId: institution.id,
                    code: updateDepartmentDto.code,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('A department with this code already exists in your institution');
            }
        }
        return this.prisma.client.department.update({
            where: { id },
            data: updateDepartmentDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.client.department.delete({
            where: { id },
        });
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        institution_service_1.InstitutionService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map