<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SupportTicketController extends Controller
{
    // For Admins
    public function indexAdmin(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        
        $tickets = DB::table('support_tickets')
            ->join('users', 'support_tickets.user_id', '=', 'users.id')
            ->where('support_tickets.tenant_id', $tenantId)
            ->select(
                'support_tickets.*', 
                'users.first_name', 
                'users.last_name', 
                'users.email'
            )
            ->orderBy('support_tickets.created_at', 'desc')
            ->get();

        return response()->json(['data' => $tickets]);
    }

    // For Students
    public function indexStudent(Request $request)
    {
        $userId = $request->user()->id;
        
        $tickets = DB::table('support_tickets')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $tickets]);
    }

    public function show(Request $request, $id)
    {
        $ticket = DB::table('support_tickets')->where('id', $id)->first();
        if (!$ticket) return response()->json(['error' => 'Not found'], 404);

        // Optional: Ensure user is admin OR owns the ticket

        $replies = DB::table('support_ticket_replies')
            ->join('users', 'support_ticket_replies.user_id', '=', 'users.id')
            ->where('ticket_id', $id)
            ->select('support_ticket_replies.*', 'users.first_name', 'users.last_name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'data' => [
                'ticket' => $ticket,
                'replies' => $replies
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:low,normal,high'
        ]);

        $ticketId = Str::uuid();

        DB::table('support_tickets')->insert([
            'id' => $ticketId,
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'normal',
            'status' => 'open',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => ['id' => $ticketId]], 201);
    }

    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        DB::table('support_ticket_replies')->insert([
            'id' => Str::uuid(),
            'ticket_id' => $id,
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Optional: Update ticket status to in_progress or similar
        DB::table('support_tickets')->where('id', $id)->update(['updated_at' => now()]);

        return response()->json(['message' => 'Replied successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved'
        ]);

        DB::table('support_tickets')->where('id', $id)->update([
            'status' => $request->status,
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Status updated']);
    }
}
