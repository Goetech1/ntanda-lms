<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentNoteController extends Controller
{
    public function index(Request $request, $courseId, $lessonId)
    {
        $userId = $request->user()->id;

        $note = DB::table('student_notes')
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('lesson_id', $lessonId)
            ->first();

        return response()->json(['data' => $note]);
    }

    public function store(Request $request, $courseId, $lessonId)
    {
        $request->validate([
            'note_text' => 'required|string'
        ]);

        $userId = $request->user()->id;
        $tenantId = $request->user()->tenant_id;

        // Upsert logic
        $existing = DB::table('student_notes')
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($existing) {
            DB::table('student_notes')
                ->where('id', $existing->id)
                ->update([
                    'note_text' => $request->note_text,
                    'updated_at' => now()
                ]);
            return response()->json(['data' => ['id' => $existing->id]]);
        } else {
            $id = Str::uuid();
            DB::table('student_notes')->insert([
                'id' => $id,
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'course_id' => $courseId,
                'lesson_id' => $lessonId,
                'note_text' => $request->note_text,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['data' => ['id' => $id]], 201);
        }
    }
}
