<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid']);
        $tenantId = $request->user()->tenant_id;
        $userId = $request->user()->id;

        $existing = Enrollment::where('tenant_id', $tenantId)->where('user_id', $userId)->where('course_id', $request->courseId)->first();
        if ($existing) {
            return response()->json(['message' => 'User is already enrolled in this course'], 409);
        }

        $enrollment = Enrollment::create([
            'tenant_id' => $tenantId,
            'user_id' => $userId,
            'course_id' => $request->courseId,
            'progress_percentage' => 0,
        ]);

        return response()->json($enrollment, 201);
    }

    public function batch(Request $request)
    {
        $validated = $request->validate([
            'courseId' => 'required|uuid|exists:courses,id',
            'studentsCSV' => 'required|string',
        ]);

        $tenantId = $request->user()->tenant_id;
        Course::where('id', $validated['courseId'])
            ->where('tenant_id', $tenantId)
            ->firstOrFail();

        $emails = collect(explode(',', $validated['studentsCSV']))
            ->map(fn($email) => trim(strtolower($email)))
            ->filter()
            ->unique()
            ->values();

        $created = [];
        $skipped = [];

        foreach ($emails as $email) {
            $student = User::where('tenant_id', $tenantId)->where('email', $email)->first();
            if (!$student) {
                $skipped[] = ['email' => $email, 'reason' => 'Student user not found'];
                continue;
            }

            $enrollment = Enrollment::firstOrCreate(
                [
                    'tenant_id' => $tenantId,
                    'user_id' => $student->id,
                    'course_id' => $validated['courseId'],
                ],
                ['progress_percentage' => 0]
            );

            if ($enrollment->wasRecentlyCreated) {
                $created[] = $enrollment;
            } else {
                $skipped[] = ['email' => $email, 'reason' => 'Already enrolled'];
            }
        }

        return response()->json([
            'created_count' => count($created),
            'skipped_count' => count($skipped),
            'created' => $created,
            'skipped' => $skipped,
        ], 201);
    }

    public function myEnrollments(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->with(['course.instructor:id,full_name'])
            ->get();
        return response()->json($enrollments);
    }

    public function byCourse(Request $request, string $courseId)
    {
        $enrollments = Enrollment::where('course_id', $courseId)
            ->where('tenant_id', $request->user()->tenant_id)
            ->with(['user:id,full_name,email'])
            ->get();
        return response()->json($enrollments);
    }

    public function updateProgress(Request $request, string $id)
    {
        $request->validate(['progress' => 'required|integer|min:0|max:100']);
        $enrollment = Enrollment::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        
        $oldProgress = $enrollment->progress_percentage;
        $newProgress = $request->progress;

        $enrollment->update([
            'progress_percentage' => $newProgress,
            'completed_at' => $newProgress === 100 ? now() : null,
        ]);

        // If progress increased, award XP (5 XP per 1% progress increase)
        if ($newProgress > $oldProgress) {
            $xpEarned = ($newProgress - $oldProgress) * 5;
            try {
                \App\Models\UserXpLog::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'tenant_id' => $enrollment->tenant_id,
                    'user_id' => $enrollment->user_id,
                    'amount' => $xpEarned,
                    'source_type' => 'course_progress',
                    'source_id' => $enrollment->course_id,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to log XP: " . $e->getMessage());
            }
        }

        // If course completed (reached 100%)
        if ($newProgress === 100 && $oldProgress < 100) {
            // 1. Award course completion bonus XP (500 XP)
            try {
                \App\Models\UserXpLog::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'tenant_id' => $enrollment->tenant_id,
                    'user_id' => $enrollment->user_id,
                    'amount' => 500,
                    'source_type' => 'course_completion',
                    'source_id' => $enrollment->course_id,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to log completion XP: " . $e->getMessage());
            }

            // 2. Check for badges linked to this course
            try {
                $badges = \App\Models\Badge::where('tenant_id', $enrollment->tenant_id)
                    ->where('course_id', $enrollment->course_id)
                    ->get();
                foreach ($badges as $badge) {
                    $hasBadge = \App\Models\BadgeAward::where('tenant_id', $enrollment->tenant_id)
                        ->where('user_id', $enrollment->user_id)
                        ->where('badge_id', $badge->id)
                        ->exists();
                    if (!$hasBadge) {
                        \App\Models\BadgeAward::create([
                            'id' => \Illuminate\Support\Str::uuid(),
                            'tenant_id' => $enrollment->tenant_id,
                            'user_id' => $enrollment->user_id,
                            'badge_id' => $badge->id,
                        ]);

                        // Webhook dispatch: student.badge_earned
                        $user = \App\Models\User::find($enrollment->user_id);
                        \App\Services\WebhookSender::dispatch($enrollment->tenant_id, 'student.badge_earned', [
                            'user_id' => $user->id,
                            'email' => $user->email,
                            'badge_id' => $badge->id,
                            'badge_title' => $badge->title,
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Badge check/webhook failed: " . $e->getMessage());
            }

            // 3. Webhook dispatch: student.course_completed
            try {
                $user = \App\Models\User::find($enrollment->user_id);
                $course = \App\Models\Course::find($enrollment->course_id);
                \App\Services\WebhookSender::dispatch($enrollment->tenant_id, 'student.course_completed', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'course_id' => $course->id,
                    'course_title' => $course->title,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Course completion webhook failed: " . $e->getMessage());
            }
        }

        return response()->json($enrollment);
    }
}
