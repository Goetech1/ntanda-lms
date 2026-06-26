<?php

namespace App\Http\Controllers;

use App\Models\CourseModule;
use Illuminate\Http\Request;

class CourseModuleController extends Controller
{
    public function index(Request $request, string $courseId)
    {
        return response()->json(CourseModule::where('course_id', $courseId)->where('tenant_id', $request->user()->tenant_id)->orderBy('order_index')->with('lessons')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'title' => 'required|string', 'orderIndex' => 'required|integer']);
        $module = CourseModule::create([
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $request->courseId,
            'title' => $request->title,
            'order_index' => $request->orderIndex,
        ]);
        return response()->json($module, 201);
    }

    public function show(Request $request, string $id)
    {
        return response()->json(CourseModule::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('lessons')->firstOrFail());
    }

    public function update(Request $request, string $id)
    {
        $module = CourseModule::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $module->update($request->only(['title', 'order_index', 'orderIndex']));
        return response()->json($module);
    }

    public function destroy(Request $request, string $id)
    {
        CourseModule::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete();
        return response()->json(['success' => true]);
    }
}
