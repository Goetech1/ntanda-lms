<?php

namespace App\Http\Controllers\Lti;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LtiOidcController extends Controller
{
    /**
     * Step 1: Third-party Initiated Login
     * The LMS (Canvas/Moodle) redirects the user here to start the OIDC flow.
     */
    public function login(Request $request)
    {
        $request->validate([
            'iss' => 'required|string',
            'login_hint' => 'required|string',
            'target_link_uri' => 'required|string',
            'client_id' => 'required|string',
        ]);

        // Find the platform configuration
        $platform = DB::table('lti_platforms')
            ->where('issuer', $request->iss)
            ->where('client_id', $request->client_id)
            ->first();

        if (!$platform) {
            return response()->json(['error' => 'Unregistered LTI Platform'], 400);
        }

        // Generate state and nonce
        $state = Str::random(32);
        $nonce = Str::random(32);

        // In a real LTI 1.3 implementation, we would store state and nonce in a cache/session.
        // For this MVP, we will construct the redirect URL back to the platform's OIDC auth endpoint.
        
        $authUrl = $platform->auth_login_url . '?' . http_build_query([
            'scope' => 'openid',
            'response_type' => 'id_token',
            'client_id' => $platform->client_id,
            'redirect_uri' => url('/api/lti/launch'),
            'login_hint' => $request->login_hint,
            'state' => $state,
            'response_mode' => 'form_post',
            'nonce' => $nonce,
            'prompt' => 'none'
        ]);

        return redirect($authUrl);
    }

    /**
     * Step 2: LTI Launch
     * The LMS POSTs the id_token (JWT) back to this endpoint.
     */
    public function launch(Request $request)
    {
        $idToken = $request->input('id_token');
        
        if (!$idToken) {
            return response()->json(['error' => 'Missing id_token'], 400);
        }

        // For this MVP, we are decoding the JWT without strict RSA signature validation
        // In production, we MUST validate the JWT signature using the platform's JWKS URL!
        $tokenParts = explode('.', $idToken);
        if (count($tokenParts) !== 3) {
            return response()->json(['error' => 'Invalid JWT format'], 400);
        }

        $payload = json_decode(base64_decode($tokenParts[1]), true);
        
        $iss = $payload['iss'] ?? null;
        $clientId = $payload['aud'] ?? null;
        if (is_array($clientId)) $clientId = $clientId[0];
        
        $sub = $payload['sub'] ?? null; // The unique user ID in the LMS
        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? 'LTI Student';

        if (!$iss || !$clientId || !$sub) {
            return response()->json(['error' => 'Invalid LTI payload claims'], 400);
        }

        $platform = DB::table('lti_platforms')
            ->where('issuer', $iss)
            ->where('client_id', $clientId)
            ->first();

        if (!$platform) {
            return response()->json(['error' => 'Unregistered LTI Platform on Launch'], 400);
        }

        // Find or create the user in Ntanda
        $ltiUser = DB::table('lti_users')
            ->where('lti_platform_id', $platform->id)
            ->where('subject_id', $sub)
            ->first();

        if ($ltiUser) {
            $user = User::find($ltiUser->user_id);
        } else {
            // Check if user exists by email, or create new
            $user = User::where('tenant_id', $platform->tenant_id)
                ->where('email', $email)
                ->first();

            if (!$user) {
                // Get STUDENT role
                $studentRole = DB::table('roles')->where('name', 'STUDENT')->first();

                $user = User::create([
                    'tenant_id' => $platform->tenant_id,
                    'role_id' => $studentRole->id,
                    'first_name' => explode(' ', $name)[0] ?? 'LTI',
                    'last_name' => explode(' ', $name)[1] ?? 'Student',
                    'email' => $email ?? ($sub . '@lti.local'),
                    'password' => bcrypt(Str::random(16)), // Secure random password
                ]);
            }

            DB::table('lti_users')->insert([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'lti_platform_id' => $platform->id,
                'subject_id' => $sub,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Generate Sanctum Token to log the user into the React SPA
        $token = $user->createToken('lti_launch')->plainTextToken;

        // Determine if it's a Deep Linking request or Resource Link request
        $messageType = $payload['https://purl.imsglobal.org/spec/lti/claim/message_type'] ?? '';
        
        if ($messageType === 'LtiDeepLinkingRequest') {
            $returnUrl = $payload['https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings']['deep_link_return_url'] ?? '';
            // Redirect to our React Deep Link Selector
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/lti/selector?token=' . $token . '&return_url=' . urlencode($returnUrl) . '&tenant_id=' . $platform->tenant_id);
        }

        // Standard Resource Link Launch
        $customCourseId = $payload['https://purl.imsglobal.org/spec/lti/claim/custom']['course_id'] ?? null;
        
        if ($customCourseId) {
            // Redirect straight to the course
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/student/courses/' . $customCourseId . '?token=' . $token . '&tenant_id=' . $platform->tenant_id);
        }

        // Default redirect to dashboard
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/student?token=' . $token . '&tenant_id=' . $platform->tenant_id);
    }
}
