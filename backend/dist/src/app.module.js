"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.tenantStorage = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const institution_module_1 = require("./modules/institution/institution.module");
const courses_module_1 = require("./modules/courses/courses.module");
const course_modules_module_1 = require("./modules/course-modules/course-modules.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const enrollments_module_1 = require("./modules/enrollments/enrollments.module");
const students_module_1 = require("./modules/students/students.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const academic_records_module_1 = require("./modules/academic-records/academic-records.module");
const instructors_module_1 = require("./modules/instructors/instructors.module");
const course_categories_module_1 = require("./modules/course-categories/course-categories.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const payments_module_1 = require("./modules/payments/payments.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const exams_module_1 = require("./modules/exams/exams.module");
const certificates_module_1 = require("./modules/certificates/certificates.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const ai_module_1 = require("./modules/ai/ai.module");
const cms_module_1 = require("./modules/cms/cms.module");
const library_module_1 = require("./modules/library/library.module");
const virtual_classroom_module_1 = require("./modules/virtual-classroom/virtual-classroom.module");
exports.tenantStorage = new async_hooks_1.AsyncLocalStorage();
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            tenant_module_1.TenantModule,
            institution_module_1.InstitutionModule,
            courses_module_1.CoursesModule,
            course_modules_module_1.CourseModulesModule,
            lessons_module_1.LessonsModule,
            enrollments_module_1.EnrollmentsModule,
            students_module_1.StudentsModule,
            attendance_module_1.AttendanceModule,
            academic_records_module_1.AcademicRecordsModule,
            instructors_module_1.InstructorsModule,
            course_categories_module_1.CourseCategoriesModule,
            assessments_module_1.AssessmentsModule,
            payments_module_1.PaymentsModule,
            subscriptions_module_1.SubscriptionsModule,
            notifications_module_1.NotificationsModule,
            exams_module_1.ExamsModule,
            certificates_module_1.CertificatesModule,
            analytics_module_1.AnalyticsModule,
            ai_module_1.AiModule,
            cms_module_1.CmsModule,
            library_module_1.LibraryModule,
            virtual_classroom_module_1.VirtualClassroomModule,
        ],
        controllers: [],
        providers: [
            {
                provide: 'TENANT_STORAGE',
                useValue: exports.tenantStorage,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map