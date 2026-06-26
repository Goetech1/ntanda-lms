<?php
namespace App\Http\Controllers;

use App\Models\LiveSession;
use Illuminate\Http\Request;

class LiveSessionController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = LiveSession::where('tenant_id', $tenantId);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->input('course_id'));
        }

        return response()->json($query->orderBy('start_time', 'asc')->get());
    }

    public function store(Request $request)
    {
        $request->merge([
            'course_id' => $request->input('course_id', $request->input('courseId')),
            'meeting_url' => $request->input('meeting_url', $request->input('meetingUrl')),
            'start_time' => $request->input('start_time', $request->input('startTime', $request->input('scheduledAt'))),
            'duration_minutes' => $request->input('duration_minutes', $request->input('durationMinutes')),
            'provider' => $request->input('provider', 'custom'),
            'status' => $request->input('status', 'scheduled'),
        ]);

        $request->validate([
            'course_id' => 'required|uuid|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'provider' => 'required|in:zoom,meet,teams,custom',
            'meeting_url' => 'nullable|url',
            'start_time' => 'required|date',
            'duration_minutes' => 'required|integer|min:1',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
        ]);

        $session = LiveSession::create([
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $request->input('course_id'),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'provider' => $request->input('provider'),
            'meeting_url' => $request->input('meeting_url'),
            'start_time' => $request->input('start_time'),
            'duration_minutes' => $request->input('duration_minutes'),
            'status' => $request->input('status'),
        ]);

        return response()->json($session, 201);
    }

    public function register(Request $request, $id)
    {
        $session = LiveSession::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        return response()->json([
            'registered' => true,
            'session' => $session,
            'join_url' => $session->meeting_url,
        ]);
    }

    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $session = LiveSession::where('tenant_id', $tenantId)->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'provider' => 'sometimes|in:zoom,meet,teams,custom',
            'meeting_url' => 'nullable|url',
            'start_time' => 'sometimes|date',
            'duration_minutes' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
        ]);

        $session->update($request->only([
            'title', 'description', 'provider', 'meeting_url', 
            'start_time', 'duration_minutes', 'status'
        ]));

        return response()->json($session);
    }

    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $session = LiveSession::where('tenant_id', $tenantId)->findOrFail($id);
        $session->delete();
        return response()->json(['message' => 'Live session deleted']);
    }
}
