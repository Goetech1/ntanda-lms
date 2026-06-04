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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSessionController = void 0;
const common_1 = require("@nestjs/common");
const academic_session_service_1 = require("../academic-session.service");
const create_academic_session_dto_1 = require("../dto/create-academic-session.dto");
const update_academic_session_dto_1 = require("../dto/update-academic-session.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const require_tenant_decorator_1 = require("../../../common/decorators/require-tenant.decorator");
let AcademicSessionController = class AcademicSessionController {
    constructor(academicSessionService) {
        this.academicSessionService = academicSessionService;
    }
    create(createDto) {
        return this.academicSessionService.create(createDto);
    }
    findAll() {
        return this.academicSessionService.findAll();
    }
    findOne(id) {
        return this.academicSessionService.findOne(id);
    }
    update(id, updateDto) {
        return this.academicSessionService.update(id, updateDto);
    }
    remove(id) {
        return this.academicSessionService.remove(id);
    }
};
exports.AcademicSessionController = AcademicSessionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_academic_session_dto_1.CreateAcademicSessionDto]),
    __metadata("design:returntype", void 0)
], AcademicSessionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicSessionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicSessionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_academic_session_dto_1.UpdateAcademicSessionDto]),
    __metadata("design:returntype", void 0)
], AcademicSessionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicSessionController.prototype, "remove", null);
exports.AcademicSessionController = AcademicSessionController = __decorate([
    (0, common_1.Controller)('academic-sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, require_tenant_decorator_1.RequireTenant)(),
    __metadata("design:paramtypes", [academic_session_service_1.AcademicSessionService])
], AcademicSessionController);
//# sourceMappingURL=academic-session.controller.js.map