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
exports.CourseModulesController = void 0;
const common_1 = require("@nestjs/common");
const course_modules_service_1 = require("./course-modules.service");
const create_course_module_dto_1 = require("./dto/create-course-module.dto");
const update_course_module_dto_1 = require("./dto/update-course-module.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let CourseModulesController = class CourseModulesController {
    constructor(courseModulesService) {
        this.courseModulesService = courseModulesService;
    }
    create(createCourseModuleDto, tenantId) {
        return this.courseModulesService.create(createCourseModuleDto, tenantId);
    }
    findAll(courseId, tenantId) {
        if (!courseId) {
            return [];
        }
        return this.courseModulesService.findAll(courseId, tenantId);
    }
    findOne(id, tenantId) {
        return this.courseModulesService.findOne(id, tenantId);
    }
    update(id, updateCourseModuleDto, tenantId) {
        return this.courseModulesService.update(id, updateCourseModuleDto, tenantId);
    }
    remove(id, tenantId) {
        return this.courseModulesService.remove(id, tenantId);
    }
};
exports.CourseModulesController = CourseModulesController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('CREATE_COURSE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_module_dto_1.CreateCourseModuleDto, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('READ_COURSE'),
    __param(0, (0, common_1.Query)('courseId')),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('READ_COURSE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('UPDATE_COURSE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_module_dto_1.UpdateCourseModuleDto, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('DELETE_COURSE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "remove", null);
exports.CourseModulesController = CourseModulesController = __decorate([
    (0, common_1.Controller)('course-modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [course_modules_service_1.CourseModulesService])
], CourseModulesController);
//# sourceMappingURL=course-modules.controller.js.map