<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseModule;
use App\Models\Lesson;
use Illuminate\Support\Facades\DB;

class CurriculumController extends Controller
{
    /**
     * Reorder modules within a course
     */
    public function reorderModules(Request $request, $courseId)
    {
        $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|uuid',
            'modules.*.order_index' => 'required|integer',
        ]);

        $tenantId = request()->attributes->get('tenant_id');

        DB::transaction(function () use ($request, $tenantId, $courseId) {
            foreach ($request->modules as $moduleData) {
                CourseModule::where('tenant_id', $tenantId)
                    ->where('course_id', $courseId)
                    ->where('id', $moduleData['id'])
                    ->update(['order_index' => $moduleData['order_index']]);
            }
        });

        return response()->json(['message' => 'Modules reordered successfully.']);
    }

    /**
     * Reorder lessons within a module
     */
    public function reorderLessons(Request $request, $moduleId)
    {
        $request->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|uuid',
            'lessons.*.order_index' => 'required|integer',
        ]);

        $tenantId = request()->attributes->get('tenant_id');

        DB::transaction(function () use ($request, $tenantId, $moduleId) {
            foreach ($request->lessons as $lessonData) {
                Lesson::where('tenant_id', $tenantId)
                    ->where('module_id', $moduleId)
                    ->where('id', $lessonData['id'])
                    ->update(['order_index' => $lessonData['order_index']]);
            }
        });

        return response()->json(['message' => 'Lessons reordered successfully.']);
    }
}
