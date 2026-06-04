import {
  Controller, Get, Param, UseGuards, Req,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

/**
 * Analytics Controller
 * PRD §15 — Analytics Module
 *
 * All routes require JWT + READ_ANALYTICS permission.
 * Tenant isolation is automatic (tenantId from JWT).
 */
@Controller('v1/analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('READ_ANALYTICS')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ── Dashboard Summary ────────────────────────────────────────────────────────
  /**
   * GET /api/v1/analytics/dashboard
   * Returns high-level KPI widgets for the admin dashboard.
   * Response: { totalStudents, totalRevenue, activeCourses, certificatesIssued }
   */
  @Get('dashboard')
  getDashboardSummary(@Req() req: any) {
    return this.analyticsService.getDashboardSummary(req.tenantId);
  }

  // ── Student Analytics ────────────────────────────────────────────────────────
  /**
   * GET /api/v1/analytics/students
   * PRD: Student Engagement, Attendance Trends
   * Returns: totalStudents, activeStudents, enrollmentsByMonth,
   *          averageProgress, completionRate, attendanceSummary,
   *          topStudents, atRiskStudents
   */
  @Get('students')
  getStudentAnalytics(@Req() req: any) {
    return this.analyticsService.getStudentAnalytics(req.tenantId);
  }

  /**
   * GET /api/v1/analytics/students/:userId
   * Individual student performance breakdown:
   * enrollments, assessments, certificates, attendance
   */
  @Get('students/:userId')
  getStudentProfile(@Req() req: any, @Param('userId') userId: string) {
    return this.analyticsService.getStudentProfile(req.tenantId, userId);
  }

  // ── Course Analytics ─────────────────────────────────────────────────────────
  /**
   * GET /api/v1/analytics/courses
   * PRD: Course Completion, Instructor Performance
   * Returns: totalCourses, coursesByStatus, topEnrolledCourses,
   *          completionRatePerCourse, avgAssessmentScore, instructorPerformance
   */
  @Get('courses')
  getCourseAnalytics(@Req() req: any) {
    return this.analyticsService.getCourseAnalytics(req.tenantId);
  }

  /**
   * GET /api/v1/analytics/courses/:courseId
   * Deep-dive analytics for a single course:
   * enrollment over time, progress distribution, assessment stats
   */
  @Get('courses/:courseId')
  getSingleCourseAnalytics(@Req() req: any, @Param('courseId') courseId: string) {
    return this.analyticsService.getSingleCourseAnalytics(req.tenantId, courseId);
  }

  // ── Revenue Analytics ────────────────────────────────────────────────────────
  /**
   * GET /api/v1/analytics/revenue
   * PRD: Revenue, Revenue Graphs
   * Returns: totalRevenue, MoM growth, monthly revenue chart,
   *          gateway breakdown, payment status, top revenue courses
   */
  @Get('revenue')
  getRevenueAnalytics(@Req() req: any) {
    return this.analyticsService.getRevenueAnalytics(req.tenantId);
  }

  // ── Institution Analytics ────────────────────────────────────────────────────
  /**
   * GET /api/v1/analytics/institution
   * PRD: Institution Performance
   * Returns: full overview KPIs, department breakdown, session activity,
   *          MAU, exam stats, notification stats, subscription status
   */
  @Get('institution')
  getInstitutionAnalytics(@Req() req: any) {
    return this.analyticsService.getInstitutionAnalytics(req.tenantId);
  }
}
