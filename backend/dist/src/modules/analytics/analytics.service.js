"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let AnalyticsService = class AnalyticsService {
    async getStudentAnalytics(tenantId) {
        const [totalStudents, activeStudents, enrollmentsByMonth, avgProgress, completionRate, attendanceSummary, topStudents, atRiskStudents,] = await Promise.all([
            prisma.studentProfile.count({ where: { tenantId } }),
            prisma.enrollment.groupBy({
                by: ['userId'],
                where: {
                    tenantId,
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                },
            }).then(r => r.length),
            prisma.$queryRaw `
        SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COUNT(*) AS count
        FROM enrollments
        WHERE tenant_id = ${tenantId}::uuid
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `,
            prisma.enrollment.aggregate({
                where: { tenantId },
                _avg: { progressPercentage: true },
            }),
            Promise.all([
                prisma.enrollment.count({ where: { tenantId } }),
                prisma.enrollment.count({ where: { tenantId, progressPercentage: 100 } }),
            ]).then(([total, completed]) => ({
                total,
                completed,
                rate: total > 0 ? Math.round((completed / total) * 100) : 0,
            })),
            prisma.attendance.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: { status: true },
            }),
            prisma.enrollment.findMany({
                where: { tenantId, progressPercentage: { gt: 0 } },
                orderBy: { progressPercentage: 'desc' },
                take: 5,
                include: {
                    user: { select: { fullName: true, email: true } },
                    course: { select: { title: true } },
                },
            }),
            prisma.enrollment.findMany({
                where: {
                    tenantId,
                    progressPercentage: { lt: 10 },
                    createdAt: { lte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
                },
                take: 10,
                include: {
                    user: { select: { fullName: true, email: true } },
                    course: { select: { title: true } },
                },
            }),
        ]);
        return {
            totalStudents,
            activeStudents,
            enrollmentsByMonth: enrollmentsByMonth.map(r => ({
                month: r.month,
                count: Number(r.count),
            })),
            averageProgress: Math.round(avgProgress._avg.progressPercentage ?? 0),
            completionRate,
            attendanceSummary: attendanceSummary.map(r => ({
                status: r.status,
                count: r._count.status,
            })),
            topStudents: topStudents.map(e => ({
                user: e.user,
                course: e.course,
                progress: e.progressPercentage,
            })),
            atRiskStudents: atRiskStudents.map(e => ({
                user: e.user,
                course: e.course,
                progress: e.progressPercentage,
                daysSinceEnrolled: Math.round((Date.now() - e.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
            })),
        };
    }
    async getStudentProfile(tenantId, studentUserId) {
        const [enrollments, submissions, certificates, attendance] = await Promise.all([
            prisma.enrollment.findMany({
                where: { tenantId, userId: studentUserId },
                include: { course: { select: { title: true, status: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.submission.findMany({
                where: { tenantId, userId: studentUserId },
                include: { assessment: { select: { title: true, type: true, totalPoints: true } } },
                orderBy: { submittedAt: 'desc' },
            }),
            prisma.certificate.count({ where: { tenantId, userId: studentUserId } }),
            prisma.attendance.groupBy({
                by: ['status'],
                where: { tenantId, userId: studentUserId },
                _count: { status: true },
            }),
        ]);
        const avgScore = submissions.filter(s => s.score !== null).reduce((a, s) => a + (s.score ?? 0), 0) /
            (submissions.filter(s => s.score !== null).length || 1);
        return {
            enrollments: enrollments.map(e => ({
                course: e.course,
                progress: e.progressPercentage,
                completedAt: e.completedAt,
                enrolledAt: e.createdAt,
            })),
            assessmentSummary: {
                total: submissions.length,
                graded: submissions.filter(s => s.status === 'GRADED').length,
                averageScore: Math.round(avgScore),
            },
            certificatesEarned: certificates,
            attendanceSummary: attendance.map(a => ({ status: a.status, count: a._count.status })),
        };
    }
    async getCourseAnalytics(tenantId) {
        const [totalCourses, coursesByStatus, topEnrolledCourses, completionRatePerCourse, avgAssessmentScorePerCourse, instructorPerformance,] = await Promise.all([
            prisma.course.count({ where: { tenantId, deletedAt: null } }),
            prisma.course.groupBy({
                by: ['status'],
                where: { tenantId, deletedAt: null },
                _count: { status: true },
            }),
            prisma.enrollment.groupBy({
                by: ['courseId'],
                where: { tenantId },
                _count: { courseId: true },
                orderBy: { _count: { courseId: 'desc' } },
                take: 10,
            }).then(async (rows) => {
                const courseIds = rows.map(r => r.courseId);
                const courses = await prisma.course.findMany({
                    where: { id: { in: courseIds } },
                    select: { id: true, title: true, thumbnailUrl: true, instructor: { select: { fullName: true } } },
                });
                return rows.map(r => ({
                    course: courses.find(c => c.id === r.courseId),
                    enrollments: r._count.courseId,
                }));
            }),
            prisma.$queryRaw `
        SELECT
          e.course_id AS "courseId",
          c.title,
          COUNT(*) AS total,
          SUM(CASE WHEN e.progress_percentage = 100 THEN 1 ELSE 0 END) AS completed
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE e.tenant_id = ${tenantId}::uuid
        GROUP BY e.course_id, c.title
        ORDER BY total DESC
        LIMIT 10
      `,
            prisma.$queryRaw `
        SELECT
          a.course_id AS "courseId",
          c.title,
          ROUND(AVG(s.score), 1) AS "avgScore"
        FROM submissions s
        JOIN assessments a ON a.id = s.assessment_id
        JOIN courses c ON c.id = a.course_id
        WHERE s.tenant_id = ${tenantId}::uuid
          AND s.score IS NOT NULL
        GROUP BY a.course_id, c.title
        ORDER BY "avgScore" DESC
        LIMIT 10
      `,
            prisma.$queryRaw `
        SELECT
          u.id AS "instructorId",
          u.full_name AS "fullName",
          COUNT(DISTINCT e.id) AS "totalEnrollments",
          COUNT(DISTINCT cert.id) AS "certificatesIssued"
        FROM courses c
        JOIN users u ON u.id = c.instructor_id
        LEFT JOIN enrollments e ON e.course_id = c.id AND e.tenant_id = ${tenantId}::uuid
        LEFT JOIN certificates cert ON cert.course_id = c.id AND cert.tenant_id = ${tenantId}::uuid
        WHERE c.tenant_id = ${tenantId}::uuid
          AND c.deleted_at IS NULL
        GROUP BY u.id, u.full_name
        ORDER BY "totalEnrollments" DESC
        LIMIT 10
      `,
        ]);
        return {
            totalCourses,
            coursesByStatus: coursesByStatus.map(r => ({ status: r.status, count: r._count.status })),
            topEnrolledCourses,
            completionRatePerCourse: completionRatePerCourse.map(r => ({
                courseId: r.courseId,
                title: r.title,
                total: Number(r.total),
                completed: Number(r.completed),
                rate: Number(r.total) > 0 ? Math.round((Number(r.completed) / Number(r.total)) * 100) : 0,
            })),
            avgAssessmentScorePerCourse,
            instructorPerformance: instructorPerformance.map(r => ({
                ...r,
                totalEnrollments: Number(r.totalEnrollments),
                certificatesIssued: Number(r.certificatesIssued),
            })),
        };
    }
    async getSingleCourseAnalytics(tenantId, courseId) {
        const [course, enrollmentOverTime, progressBuckets, submissionStats] = await Promise.all([
            prisma.course.findUnique({
                where: { id: courseId, tenantId },
                include: {
                    instructor: { select: { fullName: true } },
                    _count: { select: { enrollments: true, assessments: true, certificates: true } },
                },
            }),
            prisma.$queryRaw `
        SELECT TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') AS week, COUNT(*) AS count
        FROM enrollments
        WHERE tenant_id = ${tenantId}::uuid AND course_id = ${courseId}::uuid
          AND created_at >= NOW() - INTERVAL '8 weeks'
        GROUP BY week ORDER BY week ASC
      `,
            prisma.$queryRaw `
        SELECT
          CASE
            WHEN progress_percentage = 100 THEN 'Completed'
            WHEN progress_percentage >= 76 THEN '76-99%'
            WHEN progress_percentage >= 51 THEN '51-75%'
            WHEN progress_percentage >= 26 THEN '26-50%'
            ELSE '0-25%'
          END AS bucket,
          COUNT(*) AS count
        FROM enrollments
        WHERE tenant_id = ${tenantId}::uuid AND course_id = ${courseId}::uuid
        GROUP BY bucket
      `,
            prisma.submission.aggregate({
                where: {
                    tenantId,
                    assessment: { courseId },
                    score: { not: null },
                },
                _avg: { score: true },
                _min: { score: true },
                _max: { score: true },
                _count: { id: true },
            }),
        ]);
        return {
            course: {
                ...course,
                enrollmentCount: course?._count.enrollments,
                assessmentCount: course?._count.assessments,
                certificatesIssued: course?._count.certificates,
            },
            enrollmentOverTime: enrollmentOverTime.map(r => ({ week: r.week, count: Number(r.count) })),
            progressDistribution: progressBuckets.map(r => ({ bucket: r.bucket, count: Number(r.count) })),
            assessmentStats: {
                totalSubmissions: submissionStats._count.id,
                averageScore: Math.round(submissionStats._avg.score ?? 0),
                minScore: submissionStats._min.score,
                maxScore: submissionStats._max.score,
            },
        };
    }
    async getRevenueAnalytics(tenantId) {
        const [totalRevenue, revenueByMonth, revenueByGateway, revenueByStatus, topRevenueCourses, revenueThisMonth, revenueLastMonth,] = await Promise.all([
            prisma.payment.aggregate({
                where: { tenantId, status: 'COMPLETED' },
                _sum: { amount: true },
                _count: { id: true },
            }),
            prisma.$queryRaw `
        SELECT
          TO_CHAR(created_at, 'YYYY-MM') AS month,
          SUM(amount) AS revenue,
          COUNT(*) AS transactions
        FROM payments
        WHERE tenant_id = ${tenantId}::uuid
          AND status = 'COMPLETED'
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month ASC
      `,
            prisma.$queryRaw `
        SELECT
          CASE
            WHEN stripe_session_id LIKE 'mock_stripe_%' THEN 'Stripe'
            WHEN stripe_session_id LIKE 'mock_paystack_%' THEN 'Paystack'
            WHEN stripe_session_id LIKE 'mock_flutterwave_%' THEN 'Flutterwave'
            ELSE 'Unknown'
          END AS gateway,
          SUM(amount) AS revenue,
          COUNT(*) AS count
        FROM payments
        WHERE tenant_id = ${tenantId}::uuid AND status = 'COMPLETED'
        GROUP BY gateway
        ORDER BY revenue DESC
      `,
            prisma.payment.groupBy({
                by: ['status'],
                where: { tenantId },
                _sum: { amount: true },
                _count: { status: true },
            }),
            prisma.$queryRaw `
        SELECT
          p.course_id AS "courseId",
          c.title,
          SUM(p.amount) AS revenue,
          COUNT(*) AS sales
        FROM payments p
        JOIN courses c ON c.id = p.course_id
        WHERE p.tenant_id = ${tenantId}::uuid AND p.status = 'COMPLETED'
        GROUP BY p.course_id, c.title
        ORDER BY revenue DESC
        LIMIT 5
      `,
            prisma.payment.aggregate({
                where: {
                    tenantId,
                    status: 'COMPLETED',
                    createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
                },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: {
                    tenantId,
                    status: 'COMPLETED',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                _sum: { amount: true },
            }),
        ]);
        const thisMonth = Number(revenueThisMonth._sum.amount ?? 0);
        const lastMonth = Number(revenueLastMonth._sum.amount ?? 0);
        const monthOverMonthGrowth = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;
        return {
            summary: {
                totalRevenue: Number(totalRevenue._sum.amount ?? 0),
                totalTransactions: totalRevenue._count.id,
                revenueThisMonth: thisMonth,
                revenueLastMonth: lastMonth,
                monthOverMonthGrowth,
            },
            revenueByMonth: revenueByMonth.map(r => ({
                month: r.month,
                revenue: Number(r.revenue),
                transactions: Number(r.transactions),
            })),
            revenueByGateway: revenueByGateway.map(r => ({
                gateway: r.gateway,
                revenue: Number(r.revenue),
                count: Number(r.count),
            })),
            revenueByStatus: revenueByStatus.map(r => ({
                status: r.status,
                amount: Number(r._sum.amount ?? 0),
                count: r._count.status,
            })),
            topRevenueCourses: topRevenueCourses.map(r => ({
                courseId: r.courseId,
                title: r.title,
                revenue: Number(r.revenue),
                sales: Number(r.sales),
            })),
        };
    }
    async getInstitutionAnalytics(tenantId) {
        const [overview, departmentBreakdown, sessionActivity, certificatesThisMonth, examAttemptStats, notificationStats, monthlyActiveUsers, subscriptionStatus,] = await Promise.all([
            Promise.all([
                prisma.user.count({ where: { tenantId, deletedAt: null } }),
                prisma.course.count({ where: { tenantId, deletedAt: null } }),
                prisma.enrollment.count({ where: { tenantId } }),
                prisma.certificate.count({ where: { tenantId } }),
                prisma.submission.count({ where: { tenantId } }),
                prisma.exam.count({ where: { tenantId } }),
                prisma.notification.count({ where: { tenantId } }),
            ]).then(([users, courses, enrollments, certificates, submissions, exams, notifications]) => ({
                users,
                courses,
                enrollments,
                certificates,
                submissions,
                exams,
                notifications,
            })),
            prisma.department.findMany({
                where: { tenantId },
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            }),
            prisma.academicSession.findMany({
                where: { tenantId },
                select: { name: true, startDate: true, endDate: true, isActive: true },
                orderBy: { startDate: 'desc' },
            }),
            prisma.certificate.count({
                where: {
                    tenantId,
                    issuedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
                },
            }),
            prisma.examAttempt.aggregate({
                where: { tenantId },
                _count: { id: true },
                _avg: { score: true },
            }),
            prisma.notification.groupBy({
                by: ['channel'],
                where: { tenantId },
                _count: { channel: true },
            }),
            prisma.$queryRaw `
        SELECT COUNT(DISTINCT user_id) AS count
        FROM (
          SELECT user_id FROM enrollments
          WHERE tenant_id = ${tenantId}::uuid AND created_at >= NOW() - INTERVAL '30 days'
          UNION
          SELECT user_id FROM submissions
          WHERE tenant_id = ${tenantId}::uuid AND submitted_at >= NOW() - INTERVAL '30 days'
        ) active_users
      `,
            prisma.subscription.findFirst({
                where: { tenantId, status: 'ACTIVE' },
                select: { planName: true, status: true, currentPeriodEnd: true },
            }),
        ]);
        return {
            overview,
            departmentBreakdown,
            sessionActivity,
            certificatesThisMonth,
            examAttemptStats: {
                total: examAttemptStats._count.id,
                averageScore: Math.round(examAttemptStats._avg.score ?? 0),
            },
            notificationStats: notificationStats.map(n => ({
                channel: n.channel,
                count: n._count.channel,
            })),
            monthlyActiveUsers: Number(monthlyActiveUsers[0]?.count ?? 0),
            subscriptionStatus,
        };
    }
    async getDashboardSummary(tenantId) {
        const [students, revenue, courses, certificates] = await Promise.all([
            prisma.studentProfile.count({ where: { tenantId } }),
            prisma.payment.aggregate({ where: { tenantId, status: 'COMPLETED' }, _sum: { amount: true } }),
            prisma.course.count({ where: { tenantId, status: 'PUBLISHED', deletedAt: null } }),
            prisma.certificate.count({ where: { tenantId } }),
        ]);
        return {
            totalStudents: students,
            totalRevenue: Number(revenue._sum.amount ?? 0),
            activeCourses: courses,
            certificatesIssued: certificates,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map