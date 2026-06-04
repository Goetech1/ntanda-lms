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
exports.ExamsController = void 0;
const common_1 = require("@nestjs/common");
const exams_service_1 = require("./exams.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let ExamsController = class ExamsController {
    constructor(examsService) {
        this.examsService = examsService;
    }
    async scheduleExam(req, body) {
        return this.examsService.scheduleExam(req.tenantId, body.courseId, body.title, body.scheduledAt, body.durationMinutes, body.requireWebcam, body.secureBrowser);
    }
    async getExams(req, courseId) {
        return this.examsService.getExams(req.tenantId, courseId);
    }
    async startAttempt(req, id) {
        return this.examsService.startAttempt(req.tenantId, req.user.id, id);
    }
    async reportAntiCheat(req, id, flags) {
        return this.examsService.reportAntiCheat(req.tenantId, req.user.id, id, flags);
    }
    async submitExam(req, id, score) {
        return this.examsService.submitExam(req.tenantId, req.user.id, id, score);
    }
    async monitorExam(req, id) {
        return this.examsService.monitorExam(req.tenantId, req.user.id, id);
    }
};
exports.ExamsController = ExamsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "scheduleExam", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "getExams", null);
__decorate([
    (0, common_1.Post)(':id/attempts/start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.Patch)('attempts/:id/anti-cheat'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "reportAntiCheat", null);
__decorate([
    (0, common_1.Post)('attempts/:id/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('score')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "submitExam", null);
__decorate([
    (0, common_1.Post)(':id/monitor'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "monitorExam", null);
exports.ExamsController = ExamsController = __decorate([
    (0, common_1.Controller)('v1/exams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamsController);
//# sourceMappingURL=exams.controller.js.map