<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseModuleController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AcademicSessionController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\VirtualClassroomController;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\CourseAnnouncementController;
use App\Http\Controllers\StudentNoteController;
use App\Http\Controllers\BulkImportController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\Api\CurriculumController;
use App\Http\Controllers\Api\GradebookController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\LiveSessionController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\StudentPaymentController;
use App\Http\Controllers\StudentAccountTransactionController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\InstitutionSubscriptionController;
use App\Http\Controllers\LipilaWebhookController;

/*
|--------------------------------------------------------------------------
| API Routes - Matching existing NestJS endpoints
|--------------------------------------------------------------------------
*/

// ─── Health Check ────────────────────────────────────────────────────────────
Route::get('/health', fn() => response()->json(['status' => 'ok', 'framework' => 'Laravel', 'timestamp' => now()]));

// ─── Public Routes (No Auth) ─────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/register-institution', [AuthController::class, 'registerInstitution']);
    Route::post('/google', [AuthController::class, 'googleLogin']);
    Route::post('/microsoft', [AuthController::class, 'microsoftLogin']);
});

// Public tenant resolver
Route::get('/tenant/resolve', [TenantController::class, 'resolve']);

// LTI 1.3 Public Endpoints
Route::get('/lti/login', [\App\Http\Controllers\Lti\LtiOidcController::class, 'login']);
Route::post('/lti/launch', [\App\Http\Controllers\Lti\LtiOidcController::class, 'launch']);
Route::get('/lti/jwks/{tenantId}', [\App\Http\Controllers\Lti\LtiDeepLinkingController::class, 'jwks']);

// Public certificate validation
Route::get('/certificates/validate/{code}', [CertificateController::class, 'validate']);

// Payment webhooks (no auth)
Route::post('/v1/payments/webhook/stripe', [PaymentController::class, 'webhookStripe']);
Route::post('/v1/payments/webhook/paystack', [PaymentController::class, 'webhookPaystack']);
Route::post('/v1/payments/webhook/flutterwave', [PaymentController::class, 'webhookFlutterwave']);

// Certificate validation (public)
Route::get('/certificates/validate/{code}', [CertificateController::class, 'validate']);

// ─── Protected Routes (JWT Auth) ─────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/2fa/enable', [AuthController::class, 'enable2FA']);
    Route::get('/auth/devices', [AuthController::class, 'getDevices']);

    // Users
    Route::apiResource('users', UserController::class);

    // Tenants
    Route::get('/tenant', [TenantController::class, 'currentTenant']);
    Route::patch('/tenant', [TenantController::class, 'updateCurrentTenant']);
    Route::get('/tenant/current', [TenantController::class, 'currentTenant']);
    Route::patch('/tenant/current', [TenantController::class, 'updateCurrentTenant']);
    Route::put('/tenant/current', [TenantController::class, 'updateCurrentTenant']);
    Route::apiResource('tenants', TenantController::class);

    // Courses
    Route::apiResource('courses', CourseController::class);
    Route::post('/courses/{id}/clone', [CourseController::class, 'clone']);
    Route::post('/courses/{id}/versions', [CourseController::class, 'createVersion']);

    // Course Modules
    Route::get('/course-modules/by-course/{courseId}', [CourseModuleController::class, 'index']);
    Route::apiResource('course-modules', CourseModuleController::class)->except(['index']);

    // Lessons
    Route::get('/lessons/by-module/{moduleId}', [LessonController::class, 'index']);
    Route::apiResource('lessons', LessonController::class)->except(['index']);

    // Enrollments
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::post('/enrollments/batch', [EnrollmentController::class, 'batch']);
    Route::get('/enrollments/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/enrollments/by-course/{courseId}', [EnrollmentController::class, 'byCourse']);
    Route::patch('/enrollments/{id}/progress', [EnrollmentController::class, 'updateProgress']);

    // Assessments
    Route::apiResource('assessments', AssessmentController::class);
    Route::post('/assessments/{id}/questions', [AssessmentController::class, 'addQuestion']);

    // Course Categories
    Route::apiResource('course-categories', CourseCategoryController::class);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments/stripe/checkout', [PaymentController::class, 'checkoutStripe']);
    Route::post('/payments/paystack/checkout', [PaymentController::class, 'checkoutPaystack']);
    Route::post('/payments/flutterwave/checkout', [PaymentController::class, 'checkoutFlutterwave']);
    Route::get('/v1/payments', [PaymentController::class, 'index']);
    Route::post('/v1/payments/stripe/checkout', [PaymentController::class, 'checkoutStripe']);
    Route::post('/v1/payments/paystack/checkout', [PaymentController::class, 'checkoutPaystack']);
    Route::post('/v1/payments/flutterwave/checkout', [PaymentController::class, 'checkoutFlutterwave']);

    // Certificates
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::post('/certificates', [CertificateController::class, 'store']);
    Route::get('/certificates/my-certificates', [CertificateController::class, 'index']);
    Route::post('/certificates/issue', [CertificateController::class, 'store']);

    // Curriculum Builder
    Route::post('/courses/{courseId}/modules/reorder', [CurriculumController::class, 'reorderModules']);
    Route::post('/course-modules/{moduleId}/lessons/reorder', [CurriculumController::class, 'reorderLessons']);

    // Gradebook
    Route::get('/courses/{courseId}/gradebook', [GradebookController::class, 'getCourseGradebook']);

    // Forums
    Route::get('/courses/{courseId}/forums', [ForumController::class, 'index']);
    Route::post('/courses/{courseId}/forums', [ForumController::class, 'storeForum']);
    Route::get('/forums/{id}', [ForumController::class, 'show']);
    Route::post('/forums/{id}/posts', [ForumController::class, 'storePost']);
    Route::get('/forums/threads/{threadId}', [ForumController::class, 'showThread']);

    // Question Bank
    Route::get('/question-categories', [QuestionBankController::class, 'indexCategories']);
    Route::post('/question-categories', [QuestionBankController::class, 'storeCategory']);
    Route::delete('/question-categories/{id}', [QuestionBankController::class, 'destroyCategory']);

    Route::get('/questions', [QuestionBankController::class, 'indexQuestions']);
    Route::post('/questions', [QuestionBankController::class, 'storeQuestion']);
    Route::patch('/questions/{id}', [QuestionBankController::class, 'updateQuestion']);
    Route::delete('/questions/{id}', [QuestionBankController::class, 'destroyQuestion']);

    // Live Sessions
    Route::get('/live-sessions', [LiveSessionController::class, 'index']);
    Route::post('/live-sessions', [LiveSessionController::class, 'store']);
    Route::patch('/live-sessions/{id}', [LiveSessionController::class, 'update']);
    Route::delete('/live-sessions/{id}', [LiveSessionController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Attendance
    Route::get('/attendance/by-course/{courseId}', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::post('/attendance/batch', [AttendanceController::class, 'batch']);
    Route::post('/attendance/biometric', [AttendanceController::class, 'biometric']);
    Route::get('/attendance/by-student/{userId}', [AttendanceController::class, 'byStudent']);

    // Exams
    Route::get('/exams', [ExamController::class, 'index']);
    Route::post('/exams', [ExamController::class, 'store']);
    Route::get('/exams/course/{courseId}', [ExamController::class, 'byCourse']);
    Route::get('/v1/exams', [ExamController::class, 'index']);
    Route::post('/v1/exams', [ExamController::class, 'store']);
    Route::get('/v1/exams/course/{courseId}', [ExamController::class, 'byCourse']);
    Route::get('/exams/{id}', [ExamController::class, 'show']);
    Route::post('/exams/{examId}/start', [ExamController::class, 'startAttempt']);
    Route::patch('/exam-attempts/{attemptId}/complete', [ExamController::class, 'completeAttempt']);

    // Institution
    Route::get('/institution', [InstitutionController::class, 'show']);
    Route::patch('/institution', [InstitutionController::class, 'update']);
    Route::get('/institutions/current', [InstitutionController::class, 'show']);
    Route::patch('/institutions/current', [InstitutionController::class, 'update']);

    // Departments
    Route::apiResource('departments', DepartmentController::class);

    // Academic Sessions
    Route::patch('/academic-sessions/{id}/activate', [AcademicSessionController::class, 'activate']);
    Route::apiResource('academic-sessions', AcademicSessionController::class);

    // Instructors
    Route::get('/instructors/my-overview', [InstructorController::class, 'myOverview']);
    Route::get('/instructors/my-courses', [InstructorController::class, 'myCourses']);
    Route::get('/instructors/my-students', [InstructorController::class, 'myStudents']);
    Route::get('/instructors/my-earnings', [InstructorController::class, 'myEarnings']);
    Route::apiResource('instructors', InstructorController::class);

    // Students
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::patch('/students/{id}', [StudentController::class, 'update']);

    // Subscriptions
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);
    Route::patch('/subscriptions/{id}', [SubscriptionController::class, 'update']);

    // Roles & Permissions
    Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
    Route::apiResource('roles', RoleController::class);
    Route::get('/permissions', [PermissionController::class, 'index']);

    // Analytics
    Route::get('/analytics/dashboard', [AnalyticsController::class, 'dashboard']);
    Route::get('/analytics/instructor-dashboard', [AnalyticsController::class, 'instructorDashboard']);
    Route::get('/analytics/course/{courseId}', [AnalyticsController::class, 'courseAnalytics']);
    Route::get('/analytics/student/{userId}', [AnalyticsController::class, 'studentAnalytics']);

    // AI
    Route::post('/ai/chat', [AiController::class, 'chat']);
    Route::get('/ai/history', [AiController::class, 'history']);
    Route::post('/v1/ai/tutor', [AiController::class, 'tutor']);
    Route::post('/v1/ai/quiz-generator', [AiController::class, 'quizGenerator']);
    Route::get('/v1/ai/recommendations', [AiController::class, 'recommendations']);

    // Direct Messaging
    Route::get('/chat/conversations', [\App\Http\Controllers\ChatController::class, 'getConversations']);
    Route::get('/chat/{id}/messages', [\App\Http\Controllers\ChatController::class, 'getMessages']);
    Route::post('/chat/{id}/messages', [\App\Http\Controllers\ChatController::class, 'sendMessage']);
    Route::get('/chat/search-users', [\App\Http\Controllers\ChatController::class, 'searchUsers']);
    Route::post('/chat/start', [\App\Http\Controllers\ChatController::class, 'startConversation']);

    // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index']);

    // Virtual Classroom
    Route::post('/virtual-classroom', [VirtualClassroomController::class, 'create']);
    Route::post('/virtual-classroom/{roomId}/join', [VirtualClassroomController::class, 'join']);
    Route::get('/virtual-classrooms', [LiveSessionController::class, 'index']);
    Route::post('/virtual-classrooms/schedule', [LiveSessionController::class, 'store']);
    Route::post('/virtual-classrooms/{id}/register', [LiveSessionController::class, 'register']);

    // CMS
    Route::get('/cms/pages', [CmsController::class, 'getPages']);
    Route::post('/cms/pages', [CmsController::class, 'savePage']);

    // Library
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library', [LibraryController::class, 'upload']);
    Route::post('/library/upload', [LibraryController::class, 'upload']);

    // LTI Deep Linking (Requires Auth from React)
    Route::get('/lti/platform', [\App\Http\Controllers\Lti\LtiPlatformController::class, 'show']);
    Route::post('/lti/platform', [\App\Http\Controllers\Lti\LtiPlatformController::class, 'upsert']);
    Route::post('/lti/deep-link/generate', [\App\Http\Controllers\Lti\LtiDeepLinkingController::class, 'generateResponse']);

    // Support Tickets (Helpdesk)
    Route::get('/support/admin/tickets', [SupportTicketController::class, 'indexAdmin']);
    Route::get('/support/tickets', [SupportTicketController::class, 'indexStudent']);
    Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    Route::get('/support/tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('/support/tickets/{id}/reply', [SupportTicketController::class, 'reply']);
    Route::patch('/support/tickets/{id}/status', [SupportTicketController::class, 'updateStatus']);

    // Course Announcements
    Route::get('/courses/{courseId}/announcements', [CourseAnnouncementController::class, 'indexByCourse']);
    Route::post('/courses/{courseId}/announcements', [CourseAnnouncementController::class, 'store']);

    // Student Notes
    Route::get('/courses/{courseId}/lessons/{lessonId}/notes', [StudentNoteController::class, 'index']);
    Route::post('/courses/{courseId}/lessons/{lessonId}/notes', [StudentNoteController::class, 'store']);

    // Platform Growth Pack (Epic 6)
    Route::post('/admin/users/bulk-import', [BulkImportController::class, 'importUsers']);
    Route::get('/learning-paths', [LearningPathController::class, 'index']);
    Route::post('/learning-paths', [LearningPathController::class, 'store']);
    Route::get('/learning-paths/{id}', [LearningPathController::class, 'show']);

    // Gamification & Webhooks (Epic 7)
    Route::get('/admin/webhooks', [\App\Http\Controllers\WebhookController::class, 'index']);
    Route::post('/admin/webhooks', [\App\Http\Controllers\WebhookController::class, 'store']);
    Route::patch('/admin/webhooks/{id}', [\App\Http\Controllers\WebhookController::class, 'update']);
    Route::delete('/admin/webhooks/{id}', [\App\Http\Controllers\WebhookController::class, 'destroy']);

    Route::get('/gamification/leaderboard', [\App\Http\Controllers\GamificationController::class, 'getLeaderboard']);
    Route::get('/gamification/badges', [\App\Http\Controllers\GamificationController::class, 'getBadges']);
    Route::post('/gamification/badges', [\App\Http\Controllers\GamificationController::class, 'storeBadge']);
    Route::get('/gamification/my-badges', [\App\Http\Controllers\GamificationController::class, 'getMyBadges']);

    // Student Payment Module
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::get('/student-payments', [StudentPaymentController::class, 'index']);
    Route::post('/student-payments', [StudentPaymentController::class, 'store']);
    Route::post('/student-payments/initiate', [StudentPaymentController::class, 'initiateCollection']);
    Route::get('/student-payments/{id}', [StudentPaymentController::class, 'show']);
    Route::patch('/student-payments/{id}/review', [StudentPaymentController::class, 'review']);
    Route::get('/student-account-transactions', [StudentAccountTransactionController::class, 'index']);

    // SaaS Subscription Module
    Route::apiResource('subscription-plans', SubscriptionPlanController::class);
    Route::get('/institution-subscriptions', [InstitutionSubscriptionController::class, 'index']);
    Route::post('/institution-subscriptions/initiate', [InstitutionSubscriptionController::class, 'initiatePayment']);
});

// Lipila Webhook (Unauthenticated, verified via HMAC)
Route::post('/webhooks/lipila', [LipilaWebhookController::class, 'handle'])->name('lipila.webhook');

Route::get('/ping', function() { return 'pong'; });

// TEMPORARY FIX ROUTE FOR MISSING TENANT ID
Route::get('/fix-admin-tenant', function (\Illuminate\Http\Request $request) {
    $user = \App\Models\User::where('email', 'schooladmin@ntanda.com')->first();
    $tenant = \App\Models\Tenant::first();
    if ($user && $tenant) {
        $user->tenant_id = $tenant->id;
        $user->save();
        return response()->json(['message' => "Fixed! schooladmin@ntanda.com is now linked to tenant: " . $tenant->name]);
    }
    return response()->json(['message' => "User or Tenant not found."], 404);
});
