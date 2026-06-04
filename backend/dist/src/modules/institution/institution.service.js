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
exports.InstitutionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
const app_module_1 = require("../../app.module");
let InstitutionService = class InstitutionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCurrentInstitution() {
        const tenantId = app_module_1.tenantStorage.getStore();
        let institution = await this.prisma.client.institution.findUnique({
            where: { tenantId },
        });
        if (!institution && tenantId) {
            const tenant = await this.prisma.client.tenant.findUnique({ where: { id: tenantId } });
            if (tenant) {
                institution = await this.prisma.client.institution.create({
                    data: {
                        tenantId,
                        name: tenant.name,
                    },
                });
            }
        }
        if (!institution) {
            throw new common_1.NotFoundException('Institution not found');
        }
        return institution;
    }
    async updateCurrentInstitution(updateDto) {
        const tenantId = app_module_1.tenantStorage.getStore();
        await this.getCurrentInstitution();
        return this.prisma.client.institution.update({
            where: { tenantId },
            data: updateDto,
        });
    }
};
exports.InstitutionService = InstitutionService;
exports.InstitutionService = InstitutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstitutionService);
//# sourceMappingURL=institution.service.js.map