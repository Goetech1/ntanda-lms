<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Forum;
use App\Models\ForumPost;
use App\Models\Course;

class ForumController extends Controller
{
    /**
     * Get all forums for a course
     */
    public function index(Request $request, $courseId)
    {
        $tenantId = request()->attributes->get('tenant_id');
        
        $forums = Forum::withCount(['posts as total_threads'])
            ->where('tenant_id', $tenantId)
            ->where('course_id', $courseId)
            ->get();
            
        return response()->json($forums);
    }

    /**
     * Get a specific forum and its parent threads
     */
    public function show(Request $request, $id)
    {
        $tenantId = request()->attributes->get('tenant_id');
        
        $forum = Forum::where('tenant_id', $tenantId)->findOrFail($id);
        
        $threads = ForumPost::with('user:id,full_name,avatar_url')
            ->withCount('replies')
            ->where('tenant_id', $tenantId)
            ->where('forum_id', $id)
            ->whereNull('parent_id')
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->get();
            
        return response()->json([
            'forum' => $forum,
            'threads' => $threads
        ]);
    }

    /**
     * Get a thread and all its replies
     */
    public function showThread(Request $request, $threadId)
    {
        $tenantId = request()->attributes->get('tenant_id');
        
        $thread = ForumPost::with(['user:id,full_name,avatar_url', 'replies.user:id,full_name,avatar_url'])
            ->where('tenant_id', $tenantId)
            ->whereNull('parent_id')
            ->findOrFail($threadId);
            
        return response()->json($thread);
    }

    /**
     * Create a new forum (e.g., General Discussion, Q&A)
     */
    public function storeForum(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $tenantId = request()->attributes->get('tenant_id');

        $forum = Forum::create([
            'tenant_id' => $tenantId,
            'course_id' => $courseId,
            'title' => $request->title,
            'description' => $request->description
        ]);

        return response()->json($forum, 201);
    }

    /**
     * Create a new post (thread or reply)
     */
    public function storePost(Request $request, $forumId)
    {
        $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|uuid|exists:forum_posts,id'
        ]);

        $tenantId = request()->attributes->get('tenant_id');
        $userId = request()->attributes->get('user_id');

        $post = ForumPost::create([
            'tenant_id' => $tenantId,
            'forum_id' => $forumId,
            'user_id' => $userId,
            'parent_id' => $request->parent_id,
            'content' => $request->content
        ]);

        $post->load('user:id,full_name,avatar_url');

        return response()->json($post, 201);
    }
}
