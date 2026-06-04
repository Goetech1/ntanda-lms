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
exports.EnrollmentsController = void 0;
const common_1 = require("@nestjs/common");
const enrollments_service_1 = require("./enrollments.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    create(createEnrollmentDto, tenantId, userId) {
        return this.enrollmentsService.create(createEnrollmentDto, tenantId, userId);
    }
    findMyEnrollments(tenantId, userId) {
        return this.enrollmentsService.findAllByUser(userId, tenantId);
    }
    findByCourse(courseId, tenantId) {
        return this.enrollmentsService.findAllByCourse(courseId, tenantId);
    }
    updateProgress(id, progress, tenantId) {
        return this.enrollmentsService.updateProgress(id, progress, tenantId);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('ENROLL_COURSE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.CreateEnrollmentDto, String, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-enrollments'),
    (0, require_permissions_decorator_1.RequirePermissions)('READ_COURSE'),
    __param(0, (0, get_user_decorator_1.GetUser)('tenantId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "findMyEnrollments", null);
__decorate([
    (0, common_1.Get)('by-course/:courseId'),
    (0, require_permissions_decorator_1.RequirePermissions)('READ_ENROLLMENT'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "findByCourse", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    (0, require_permissions_decorator_1.RequirePermissions)('UPDATE_ENROLLMENT_PROGRESS'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('progress')),
    __param(2, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "updateProgress", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, common_1.Controller)('enrollments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map