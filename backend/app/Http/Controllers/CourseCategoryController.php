<?php

namespace App\Http\Controllers;

use App\Models\CourseCategory;
use Illuminate\Http\Request;

class CourseCategoryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(CourseCategory::where('tenant_id', $request->user()->tenant_id)->with('courses')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'slug' => 'required']);
        return response()->json(CourseCategory::create([
            'tenant_id' => $request->user()->tenant_id,
            ...$request->only(['name', 'slug', 'description']),
        ]), 201);
    }

    public function show(Request $request, string $id)
    {
        return response()->json(CourseCategory::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail());
    }

    public function update(Request $request, string $id)
    {
        $cat = CourseCategory::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $cat->update($request->only(['name', 'slug', 'description']));
        return response()->json($cat);
    }

    public function destroy(Request $request, string $id)
    {
        CourseCategory::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete();
        return response()->json(['success' => true]);
    }
}
