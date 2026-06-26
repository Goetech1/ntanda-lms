<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\Institution;
use App\Models\Subscription;
use App\Models\RefreshToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $tenantId = $request->header('x-tenant-id');

        $query = User::with(['role.permissions']);
        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }
        $user = $query->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errorCode' => 'AUTH_001',
            ], 401);
        }

        $token = JWTAuth::fromUser($user);

        // Generate refresh token
        $rawRefreshToken = Str::random(128);
        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => Hash::make($rawRefreshToken),
            'expires_at' => now()->addDays(7),
        ]);

        // Set HTTP-Only Cookie
        $cookie = cookie('refresh_token', "{$user->id}:{$rawRefreshToken}", 60 * 24 * 7, '/', null, config('app.env') === 'production', true, false, 'strict');

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'role' => $user->role->name,
                    'full_name' => $user->full_name,
                ],
            ],
        ])->withCookie($cookie);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
        ]);

        $tenantId = $request->header('x-tenant-id');

        $existing = User::where('email', $request->email);
        if ($tenantId) {
            $existing->where('tenant_id', $tenantId);
        }
        if ($existing->exists()) {
            return response()->json([
                'message' => 'Email already exists',
                'errorCode' => 'AUTH_003',
            ], 409);
        }

        $studentRole = Role::where('name', 'STUDENT')
            ->where(function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId)->orWhere('is_system', true);
            })->first();

        if (!$studentRole) {
            return response()->json(['message' => 'Default STUDENT role not found'], 409);
        }

        $user = User::create([
            'tenant_id' => $tenantId,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'full_name' => "{$request->firstName} {$request->lastName}",
            'role_id' => $studentRole->id,
        ]);

        $user->load('role');

        // Dispatch student.registered webhook
        try {
            \App\Services\WebhookSender::dispatch($tenantId, 'student.registered', [
                'id' => $user->id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'created_at' => $user->created_at,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Webhook error during registration: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role->name,
                ],
            ],
        ], 201);
    }

    public function refresh(Request $request)
    {
        $cookieToken = $request->cookie('refresh_token');
        if (!$cookieToken || !str_contains($cookieToken, ':')) {
            return response()->json(['message' => 'Refresh token not found or invalid', 'errorCode' => 'AUTH_004'], 401);
        }

        [$userId, $token] = explode(':', $cookieToken, 2);
        if (!$userId || !$token) {
            return response()->json(['message' => 'Refresh token invalid format', 'errorCode' => 'AUTH_004'], 401);
        }

        $userTokens = RefreshToken::where('user_id', $userId)
            ->where('is_revoked', false)
            ->where('expires_at', '>', now())
            ->get();

        $validToken = null;
        foreach ($userTokens as $rt) {
            if (Hash::check($token, $rt->token_hash)) {
                $validToken = $rt;
                break;
            }
        }

        if (!$validToken) {
            return response()->json(['message' => 'Invalid refresh token', 'errorCode' => 'AUTH_004'], 401);
        }

        $validToken->update(['is_revoked' => true]);

        $user = User::with('role.permissions')->findOrFail($userId);
        $accessToken = JWTAuth::fromUser($user);

        $newRawRefreshToken = Str::random(128);
        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => Hash::make($newRawRefreshToken),
            'expires_at' => now()->addDays(7),
        ]);

        $cookie = cookie('refresh_token', "{$userId}:{$newRawRefreshToken}", 60 * 24 * 7, '/', null, config('app.env') === 'production', true, false, 'strict');

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => ['access_token' => $accessToken],
        ])->withCookie($cookie);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $cookieToken = $request->cookie('refresh_token');

        if ($cookieToken && str_contains($cookieToken, ':')) {
            $token = explode(':', $cookieToken, 2)[1];
            $userTokens = RefreshToken::where('user_id', $user->id)->where('is_revoked', false)->get();
            foreach ($userTokens as $rt) {
                if (Hash::check($token, $rt->token_hash)) {
                    $rt->update(['is_revoked' => true]);
                    break;
                }
            }
        } else {
            RefreshToken::where('user_id', $user->id)->where('is_revoked', false)->update(['is_revoked' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ])->withCookie(cookie()->forget('refresh_token'));
    }

    public function googleLogin(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Google login is not configured. Set up Google OAuth client verification before enabling this endpoint.',
        ], 501);
    }

    public function microsoftLogin(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Microsoft login is not configured. Set up Microsoft identity token verification before enabling this endpoint.',
        ], 501);
    }

    public function enable2FA(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Two-factor authentication requires a persisted secret and verification flow before it can be enabled.',
        ], 501);
    }

    public function getDevices(Request $request)
    {
        return response()->json(['success' => true, 'data' => [['id' => 'device-1', 'name' => 'Browser']]]);
    }

    public function registerInstitution(Request $request)
    {
        $request->validate([
            'institutionName' => 'required|string',
            'subdomain' => 'required|string',
            'adminFullName' => 'required|string',
            'adminEmail' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $existingTenant = Tenant::where('subdomain', $request->subdomain)
            ->orWhere(function ($q) use ($request) {
                if ($request->domain) {
                    $q->where('domain', $request->domain);
                }
            })->first();

        if ($existingTenant) {
            return response()->json([
                'message' => 'An institution with this subdomain or domain already exists',
                'errorCode' => 'AUTH_003',
            ], 409);
        }

        $adminRole = Role::where('name', 'ADMIN')->where('is_system', true)->first();
        if (!$adminRole) {
            return response()->json(['message' => 'Default ADMIN role not found'], 409);
        }

        $result = DB::transaction(function () use ($request, $adminRole) {
            $tenant = Tenant::create([
                'name' => $request->institutionName,
                'subdomain' => $request->subdomain,
                'domain' => $request->domain ?? "{$request->subdomain}.lmsplatform.com",
                'status' => 'ACTIVE',
                'branding' => [
                    'primaryColor' => '#004AC6',
                    'secondaryColor' => '#7C43AB',
                    'logoUrl' => $request->logoUrl ?? '',
                ],
            ]);

            Institution::create([
                'tenant_id' => $tenant->id,
                'name' => $request->institutionName,
                'address' => $request->address,
                'contact_email' => $request->institutionEmail,
                'contact_phone' => $request->phone,
                'settings' => [
                    'institutionType' => $request->institutionType,
                    'websiteUrl' => $request->websiteUrl,
                ],
            ]);

            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_name' => $request->subscriptionPackage ?? 'basic',
                'stripe_subscription_id' => "manual_{$tenant->id}_" . time(),
                'status' => 'ACTIVE',
                'current_period_end' => now()->addYear(),
            ]);

            $adminUser = User::create([
                'tenant_id' => $tenant->id,
                'email' => $request->adminEmail,
                'password_hash' => Hash::make($request->password),
                'full_name' => $request->adminFullName,
                'role_id' => $adminRole->id,
            ]);

            return [
                'tenantId' => $tenant->id,
                'tenantName' => $tenant->name,
                'subdomain' => $tenant->subdomain,
                'domain' => $tenant->domain,
                'adminUser' => [
                    'id' => $adminUser->id,
                    'email' => $adminUser->email,
                    'fullName' => $adminUser->full_name,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Institution registered and onboarded successfully',
            'data' => $result,
        ], 201);
    }
}
