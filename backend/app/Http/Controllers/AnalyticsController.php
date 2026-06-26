<?php
namespace App\Http\Controllers;
use App\Models\Enrollment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        
        // 1. KPI Top-line metrics
        $kpis = [
            'totalStudents' => DB::table('users')->where('users.tenant_id', $tenantId)->join('roles', 'users.role_id', '=', 'roles.id')->where('roles.name', 'STUDENT')->count(),
            'totalCourses' => DB::table('courses')->where('tenant_id', $tenantId)->whereNull('deleted_at')->count(),
            'totalEnrollments' => DB::table('enrollments')->where('tenant_id', $tenantId)->count(),
            'totalRevenue' => DB::table('payments')->where('tenant_id', $tenantId)->where('status', 'COMPLETED')->sum('amount'),
        ];

        // 2. Revenue over the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();
        $revenueData = DB::table('payments')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(amount) as revenue'))
            ->where('tenant_id', $tenantId)
            ->where('status', 'COMPLETED')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 3. Enrollments over the last 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(29)->startOfDay();
        $enrollmentData = DB::table('enrollments')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('tenant_id', $tenantId)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'kpis' => $kpis,
            'revenueChart' => $revenueData,
            'enrollmentChart' => $enrollmentData
        ]);
    }

    public function instructorDashboard(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $instructorId = $request->user()->id;

        $courses = DB::table('courses')->where('tenant_id', $tenantId)->where('instructor_id', $instructorId)->pluck('id');

        $kpis = [
            'totalStudents' => DB::table('enrollments')->whereIn('course_id', $courses)->distinct('user_id')->count(),
            'totalCourses' => count($courses),
            'totalEnrollments' => DB::table('enrollments')->whereIn('course_id', $courses)->count(),
            'totalRevenue' => DB::table('payments')->whereIn('course_id', $courses)->where('status', 'COMPLETED')->sum('amount'),
        ];

        // Revenue per course
        $revenueByCourse = DB::table('payments')
            ->join('courses', 'payments.course_id', '=', 'courses.id')
            ->select('courses.title as name', DB::raw('SUM(payments.amount) as value'))
            ->whereIn('payments.course_id', $courses)
            ->where('payments.status', 'COMPLETED')
            ->groupBy('courses.title')
            ->get();

        // Recent activity / enrollments over 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(29)->startOfDay();
        $enrollmentData = DB::table('enrollments')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->whereIn('course_id', $courses)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'kpis' => $kpis,
            'revenueByCourse' => $revenueByCourse,
            'enrollmentChart' => $enrollmentData
        ]);
    }

    public function courseAnalytics(Request $request, string $courseId)
    {
        $tenantId = $request->user()->tenant_id;
        return response()->json([
            'enrollmentCount' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('course_id', $courseId)->count(),
            'avgProgress' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('course_id', $courseId)->avg('progress_percentage') ?? 0,
            'completionCount' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('course_id', $courseId)->whereNotNull('completed_at')->count(),
        ]);
    }

    public function studentAnalytics(Request $request, string $userId)
    {
        $tenantId = $request->user()->tenant_id;
        return response()->json([
            'enrolledCourses' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('user_id', $userId)->count(),
            'completedCourses' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('user_id', $userId)->whereNotNull('completed_at')->count(),
            'avgProgress' => DB::table('enrollments')->where('tenant_id', $tenantId)->where('user_id', $userId)->avg('progress_percentage') ?? 0,
        ]);
    }
}
