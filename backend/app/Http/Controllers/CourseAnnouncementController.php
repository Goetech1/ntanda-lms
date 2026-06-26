<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CourseAnnouncementController extends Controller
{
    public function indexByCourse($courseId)
    {
        $announcements = DB::table('course_announcements')
            ->join('users', 'course_announcements.instructor_id', '=', 'users.id')
            ->where('course_announcements.course_id', $courseId)
            ->select('course_announcements.*', 'users.first_name', 'users.last_name')
            ->orderBy('course_announcements.created_at', 'desc')
            ->get();

        return response()->json(['data' => $announcements]);
    }

    public function store(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string'
        ]);

        $id = Str::uuid();

        DB::table('course_announcements')->insert([
            'id' => $id,
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $courseId,
            'instructor_id' => $request->user()->id,
            'title' => $request->title,
            'content' => $request->content,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Note: For future expansion, trigger an event here to email enrolled students

        return response()->json(['data' => ['id' => $id]], 201);
    }
}
