<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userPermissions = $user->role?->permissions?->map(fn($p) => "{$p->action}_{$p->resource}")->toArray() ?? [];

        // SUPER_ADMIN and ADMIN bypass permission checks
        $roleName = $user->role?->name;
        if (in_array($roleName, ['SUPER_ADMIN', 'ADMIN'])) {
            return $next($request);
        }

        if (!in_array($permission, $userPermissions)) {
            return response()->json(['message' => 'Forbidden: insufficient permissions'], 403);
        }

        return $next($request);
    }
}
