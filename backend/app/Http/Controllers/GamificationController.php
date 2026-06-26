<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\BadgeAward;
use App\Models\UserXpLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GamificationController extends Controller
{
    public function getLeaderboard(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        // Fetch students and sum their XP
        $leaderboard = User::where('users.tenant_id', $tenantId)
            ->leftJoin('user_xp_logs', 'users.id', '=', 'user_xp_logs.user_id')
            ->select(
                'users.id',
                'users.full_name',
                'users.email',
                DB::raw('COALESCE(SUM(user_xp_logs.amount), 0) as total_xp')
            )
            ->groupBy('users.id', 'users.full_name', 'users.email')
            ->orderBy('total_xp', 'desc')
            ->get();

        return response()->json([
            'leaderboard' => $leaderboard,
            'current_user_xp' => $leaderboard->firstWhere('id', $request->user()->id)->total_xp ?? 0
        ]);
    }

    public function getBadges(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $badges = Badge::where('tenant_id', $tenantId)
            ->with(['course', 'learningPath'])
            ->get();

        return response()->json($badges);
    }

    public function getMyBadges(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $userId = $request->user()->id;

        $awards = BadgeAward::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->with('badge')
            ->get();

        return response()->json($awards);
    }

    // Helper for Admin / Instructors to define badges
    public function storeBadge(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon_name' => 'required|string',
            'course_id' => 'nullable|uuid|exists:courses,id',
            'learning_path_id' => 'nullable|uuid|exists:learning_paths,id'
        ]);

        $tenantId = $request->user()->tenant_id;

        $badge = Badge::create([
            'tenant_id' => $tenantId,
            'title' => $request->title,
            'description' => $request->description,
            'icon_name' => $request->icon_name,
            'course_id' => $request->course_id,
            'learning_path_id' => $request->learning_path_id
        ]);

        return response()->json($badge, 201);
    }
}
