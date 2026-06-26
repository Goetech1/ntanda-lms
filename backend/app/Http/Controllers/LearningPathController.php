<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LearningPathController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        
        $paths = DB::table('learning_paths')
            ->where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Attach course count (simple approach)
        foreach ($paths as $path) {
            $path->course_count = DB::table('learning_path_courses')->where('path_id', $path->id)->count();
        }

        return response()->json(['data' => $paths]);
    }

    public function show(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $path = DB::table('learning_paths')->where('id', $id)->where('tenant_id', $tenantId)->first();
        if (!$path) return response()->json(['error' => 'Not found'], 404);

        $courses = DB::table('learning_path_courses')
            ->join('courses', 'learning_path_courses.course_id', '=', 'courses.id')
            ->where('learning_path_courses.path_id', $id)
            ->select('courses.id', 'courses.title', 'courses.thumbnail_url', 'learning_path_courses.sequence_order')
            ->orderBy('learning_path_courses.sequence_order', 'asc')
            ->get();

        $path->courses = $courses;

        return response()->json(['data' => $path]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'courses' => 'nullable|array'
        ]);

        $pathId = Str::uuid();

        DB::table('learning_paths')->insert([
            'id' => $pathId,
            'tenant_id' => $request->user()->tenant_id,
            'title' => $request->title,
            'description' => $request->description,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (!empty($request->courses)) {
            foreach ($request->courses as $index => $courseId) {
                DB::table('learning_path_courses')->insert([
                    'path_id' => $pathId,
                    'course_id' => $courseId,
                    'sequence_order' => $index
                ]);
            }
        }

        return response()->json(['data' => ['id' => $pathId]], 201);
    }
}
