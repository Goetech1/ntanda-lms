import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CourseModulesModule } from './modules/course-modules/course-modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { StudentsModule } from './modules/students/students.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AcademicRecordsModule } from './modules/academic-records/academic-records.module';
import { InstructorsModule } from './modules/instructors/instructors.module';
import { CourseCategoriesModule } from './modules/course-categories/course-categories.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ExamsModule } from './modules/exams/exams.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { CmsModule } from './modules/cms/cms.module';
import { LibraryModule } from './modules/library/library.module';
import { VirtualClassroomModule } from './modules/virtual-classroom/virtual-classroom.module';

// Setup AsyncLocalStorage for strict tenant isolation
export const tenantStorage = new AsyncLocalStorage<string | undefined>();

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    TenantModule,
    InstitutionModule,
    CoursesModule,
    CourseModulesModule,
    LessonsModule,
    EnrollmentsModule,
    StudentsModule,
    AttendanceModule,
    AcademicRecordsModule,
    InstructorsModule,
    CourseCategoriesModule,
    AssessmentsModule,
    PaymentsModule,
    SubscriptionsModule,
    NotificationsModule,
    ExamsModule,
    CertificatesModule,
    AnalyticsModule,
    AiModule,
    CmsModule,
    LibraryModule,
    VirtualClassroomModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'TENANT_STORAGE',
      useValue: tenantStorage,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
