<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;
        
        $conversations = Conversation::where('tenant_id', $request->user()->tenant_id)
            ->whereHas('users', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->with(['users' => function($q) use ($userId) {
                $q->where('user_id', '!=', $userId)->select('users.id', 'users.full_name', 'users.avatar_url', 'users.email');
            }])
            ->with(['messages' => function($q) {
                $q->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->get();
            
        return response()->json($conversations);
    }

    public function getMessages(Request $request, $conversationId)
    {
        $userId = $request->user()->id;
        
        $conversation = Conversation::where('id', $conversationId)
            ->where('tenant_id', $request->user()->tenant_id)
            ->whereHas('users', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })->firstOrFail();
            
        // Update last read
        $conversation->users()->updateExistingPivot($userId, ['last_read_at' => now()]);
            
        $messages = Message::where('conversation_id', $conversation->id)
            ->with(['sender' => function($q) {
                $q->select('id', 'full_name', 'avatar_url');
            }])
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }

    public function sendMessage(Request $request, $conversationId)
    {
        $request->validate(['content' => 'required|string']);
        $userId = $request->user()->id;
        
        $conversation = Conversation::where('id', $conversationId)
            ->where('tenant_id', $request->user()->tenant_id)
            ->whereHas('users', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })->firstOrFail();
            
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'content' => $request->content
        ]);
        
        $conversation->touch(); // Update updated_at
        
        return response()->json($message->load('sender:id,full_name,avatar_url'));
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('q', '');
        
        $users = User::where('tenant_id', $request->user()->tenant_id)
            ->where('id', '!=', $request->user()->id)
            ->whereHas('role', function($q) {
                $q->where('name', '!=', 'SUPER_ADMIN');
            })
            ->where(function($q) use ($query) {
                $q->where('full_name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->select('id', 'full_name', 'email', 'avatar_url', 'role_id')
            ->with('role:id,name')
            ->limit(20)
            ->get();
            
        return response()->json($users);
    }

    public function startConversation(Request $request)
    {
        $request->validate(['user_id' => 'required|uuid']);
        $userId = $request->user()->id;
        $targetUserId = $request->user_id;
        
        if ($userId === $targetUserId) {
            return response()->json(['message' => 'Cannot start conversation with yourself'], 400);
        }
        
        $targetUser = User::where('id', $targetUserId)
            ->where('tenant_id', $request->user()->tenant_id)
            ->firstOrFail();
            
        $existingConv = Conversation::where('tenant_id', $request->user()->tenant_id)
            ->whereHas('users', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->whereHas('users', function($q) use ($targetUserId) {
                $q->where('user_id', $targetUserId);
            })->first();
            
        if ($existingConv) {
            return response()->json($existingConv);
        }
        
        $conversation = Conversation::create([
            'tenant_id' => $request->user()->tenant_id
        ]);
        
        $conversation->users()->attach([$userId, $targetUserId]);
        
        return response()->json($conversation);
    }
}
