<?php

namespace App\Http\Controllers\Lti;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LtiPlatformController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(
            DB::table('lti_platforms')
                ->where('tenant_id', $request->user()->tenant_id)
                ->orderByDesc('created_at')
                ->first()
        );
    }

    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'issuer' => 'required|url',
            'client_id' => 'required|string|max:255',
            'auth_login_url' => 'required|url',
            'auth_token_url' => 'required|url',
            'key_set_url' => 'required|url',
            'deployment_id' => 'required|string|max:255',
        ]);

        $tenantId = $request->user()->tenant_id;
        $existing = DB::table('lti_platforms')->where('tenant_id', $tenantId)->first();
        $now = now();

        if ($existing) {
            DB::table('lti_platforms')
                ->where('id', $existing->id)
                ->update([...$validated, 'updated_at' => $now]);
            $id = $existing->id;
        } else {
            $id = (string) Str::uuid();
            DB::table('lti_platforms')->insert([
                'id' => $id,
                'tenant_id' => $tenantId,
                ...$validated,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        return response()->json(DB::table('lti_platforms')->where('id', $id)->first(), $existing ? 200 : 201);
    }
}
