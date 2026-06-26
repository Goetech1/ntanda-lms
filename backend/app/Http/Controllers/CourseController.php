<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $courses = Course::where('tenant_id', $tenantId)
            ->whereNull('deleted_at')
            ->with(['instructor:id,full_name,email'])
            ->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $course = Course::create([
            ...$request->only(['title', 'description', 'thumbnail_url', 'status', 'price', 'category_id']),
            'tenant_id' => $request->user()->tenant_id,
            'instructor_id' => $request->user()->id,
        ]);

        return response()->json($course, 201);
    }

    public function show(Request $request, string $id)
    {
        $course = Course::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->whereNull('deleted_at')
            ->with(['instructor:id,full_name,email', 'modules' => fn($q) => $q->orderBy('order_index')->with(['lessons' => fn($q2) => $q2->orderBy('order_index')])])
            ->firstOrFail();
        return response()->json($course);
    }

    public function update(Request $request, string $id)
    {
        $course = Course::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->whereNull('deleted_at')->firstOrFail();
        $course->update($request->only(['title', 'description', 'thumbnail_url', 'status', 'price', 'category_id']));
        return response()->json($course);
    }

    public function destroy(Request $request, string $id)
    {
        $course = Course::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $course->update(['deleted_at' => now()]);
        return response()->json($course);
    }

    public function clone(Request $request, string $id)
    {
        $source = Course::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->with(['modules.lessons'])
            ->firstOrFail();

        $clone = DB::transaction(function () use ($source, $request) {
            $course = $source->replicate(['id', 'created_at', 'updated_at', 'deleted_at']);
            $course->title = $request->input('title', $source->title . ' (Copy)');
            $course->status = 'DRAFT';
            $course->version = 1;
            $course->instructor_id = $request->user()->id;
            $course->save();

            foreach ($source->modules as $module) {
                $newModule = $module->replicate(['id', 'created_at', 'updated_at']);
                $newModule->course_id = $course->id;
                $newModule->save();

                foreach ($module->lessons as $lesson) {
                    $newLesson = $lesson->replicate(['id', 'created_at', 'updated_at']);
                    $newLesson->module_id = $newModule->id;
                    $newLesson->save();
                }
            }

            return $course->load(['modules.lessons']);
        });

        return response()->json(['success' => true, 'message' => 'Course cloned successfully', 'newCourseId' => $clone->id, 'course' => $clone], 201);
    }

    public function createVersion(Request $request, string $id)
    {
        $source = Course::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->with(['modules.lessons'])
            ->firstOrFail();

        $version = DB::transaction(function () use ($source, $request) {
            $course = $source->replicate(['id', 'created_at', 'updated_at', 'deleted_at']);
            $course->title = $request->input('title', $source->title . ' v' . ($source->version + 1));
            $course->status = 'DRAFT';
            $course->version = $source->version + 1;
            $course->save();

            foreach ($source->modules as $module) {
                $newModule = $module->replicate(['id', 'created_at', 'updated_at']);
                $newModule->course_id = $course->id;
                $newModule->save();

                foreach ($module->lessons as $lesson) {
                    $newLesson = $lesson->replicate(['id', 'created_at', 'updated_at']);
                    $newLesson->module_id = $newModule->id;
                    $newLesson->save();
                }
            }

            return $course->load(['modules.lessons']);
        });

        return response()->json(['success' => true, 'message' => 'New course version created', 'newVersionId' => $version->id, 'course' => $version], 201);
    }
}
