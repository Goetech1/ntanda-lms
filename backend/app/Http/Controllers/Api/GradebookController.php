<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use App\Models\Assessment;

class GradebookController extends Controller
{
    /**
     * Get the gradebook for a specific course
     */
    public function getCourseGradebook(Request $request, $courseId)
    {
        $tenantId = request()->attributes->get('tenant_id');

        // Verify the course belongs to the tenant
        $course = Course::where('tenant_id', $tenantId)->findOrFail($courseId);

        // Get all enrollments for this course with user details
        $enrollments = Enrollment::with('user:id,full_name,email')
            ->where('tenant_id', $tenantId)
            ->where('course_id', $courseId)
            ->get();

        // Get all assessments for this course
        $assessments = Assessment::where('tenant_id', $tenantId)
            ->where('course_id', $courseId)
            ->get();

        $assessmentIds = $assessments->pluck('id');

        // Get all submissions for these assessments
        $submissions = Submission::where('tenant_id', $tenantId)
            ->whereIn('assessment_id', $assessmentIds)
            ->get()
            ->groupBy('user_id');

        // Map the data into a spreadsheet-friendly format
        $gradebook = $enrollments->map(function ($enrollment) use ($assessments, $submissions) {
            $userSubmissions = $submissions->get($enrollment->user_id, collect());
            
            $grades = $assessments->mapWithKeys(function ($assessment) use ($userSubmissions) {
                $submission = $userSubmissions->firstWhere('assessment_id', $assessment->id);
                return [
                    $assessment->id => [
                        'score' => $submission ? $submission->score : null,
                        'status' => $submission ? $submission->status : 'NOT_SUBMITTED',
                        'total_points' => $assessment->total_points
                    ]
                ];
            });

            return [
                'user_id' => $enrollment->user_id,
                'user_name' => $enrollment->user->full_name,
                'user_email' => $enrollment->user->email,
                'progress_percentage' => $enrollment->progress_percentage,
                'completed_at' => $enrollment->completed_at,
                'grades' => $grades
            ];
        });

        return response()->json([
            'course_id' => $course->id,
            'course_title' => $course->title,
            'assessments' => $assessments->map(function ($a) {
                return ['id' => $a->id, 'title' => $a->title, 'type' => $a->type, 'total_points' => $a->total_points];
            }),
            'students' => $gradebook
        ]);
    }
}
