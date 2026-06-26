<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request, string $moduleId)
    {
        return response()->json(Lesson::where('module_id', $moduleId)->where('tenant_id', $request->user()->tenant_id)->orderBy('order_index')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['moduleId' => 'required|uuid', 'title' => 'required|string', 'content' => 'required|string', 'orderIndex' => 'required|integer']);
        $lesson = Lesson::create([
            'tenant_id' => $request->user()->tenant_id,
            'module_id' => $request->moduleId,
            'title' => $request->title,
            'content' => $request->content,
            'video_url' => $request->videoUrl,
            'order_index' => $request->orderIndex,
        ]);
        return response()->json($lesson, 201);
    }

    public function show(Request $request, string $id)
    {
        return response()->json(Lesson::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail());
    }

    public function update(Request $request, string $id)
    {
        $lesson = Lesson::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $lesson->update($request->only(['title', 'content', 'video_url', 'videoUrl', 'order_index', 'orderIndex']));
        return response()->json($lesson);
    }

    public function destroy(Request $request, string $id)
    {
        Lesson::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete();
        return response()->json(['success' => true]);
    }
}
