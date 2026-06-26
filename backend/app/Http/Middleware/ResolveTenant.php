<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ResolveTenant
{
    public function handle(Request $request, Closure $next)
    {
        $tenantId = $request->header('x-tenant-id');

        if ($tenantId) {
            $request->merge(['tenant_id' => $tenantId]);
        }

        return $next($request);
    }
}
