<?php

namespace App\Http\Controllers\Lti;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LtiDeepLinkingController extends Controller
{
    public function jwks(string $tenantId)
    {
        $publicKey = $this->getPublicKey();
        if (!$publicKey) {
            return response()->json(['error' => 'LTI public key is not configured'], 503);
        }

        $details = openssl_pkey_get_details(openssl_pkey_get_public($publicKey));
        if (!$details || empty($details['rsa'])) {
            return response()->json(['error' => 'Invalid LTI public key'], 500);
        }

        return response()->json([
            'keys' => [[
                'kty' => 'RSA',
                'use' => 'sig',
                'kid' => env('LTI_KEY_ID', $tenantId),
                'alg' => 'RS256',
                'n' => $this->base64UrlEncode($details['rsa']['n']),
                'e' => $this->base64UrlEncode($details['rsa']['e']),
            ]],
        ]);
    }

    /**
     * Called by our React frontend to generate the signed LTI Deep Linking Response.
     */
    public function generateResponse(Request $request)
    {
        $request->validate([
            'return_url' => 'required|url',
            'course_id' => 'required|uuid',
            'course_title' => 'required|string',
        ]);

        $tenantId = $request->user()->tenant_id;
        
        // Find a matching platform for this tenant
        $platform = DB::table('lti_platforms')
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$platform) {
            return response()->json(['error' => 'No LTI Platform configured for this tenant'], 400);
        }

        // Construct the ContentItem payload
        $contentItem = [
            'type' => 'ltiResourceLink',
            'title' => $request->course_title,
            'url' => env('APP_URL') . '/api/lti/launch',
            'custom' => [
                'course_id' => $request->course_id
            ]
        ];

        // Construct the JWT Payload
        $jwtPayload = [
            'iss' => $platform->client_id, // We act as the tool (issuer) here usually it's the client ID
            'aud' => $platform->issuer,    // The LMS
            'iat' => time(),
            'exp' => time() + 300,         // 5 minutes
            'https://purl.imsglobal.org/spec/lti/claim/message_type' => 'LtiDeepLinkingResponse',
            'https://purl.imsglobal.org/spec/lti/claim/version' => '1.3.0',
            'https://purl.imsglobal.org/spec/lti/claim/deployment_id' => $platform->deployment_id,
            'https://purl.imsglobal.org/spec/lti-dl/claim/content_items' => [
                $contentItem
            ]
        ];

        $privateKey = $this->getPrivateKey();
        if (!$privateKey) {
            return response()->json(['error' => 'LTI private key is not configured'], 503);
        }

        $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT', 'kid' => env('LTI_KEY_ID', $tenantId)]));
        $payload = $this->base64UrlEncode(json_encode($jwtPayload));
        $signingInput = $header . '.' . $payload;

        $signature = '';
        if (!openssl_sign($signingInput, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
            return response()->json(['error' => 'Unable to sign LTI deep-link response'], 500);
        }

        $jwt = $signingInput . '.' . $this->base64UrlEncode($signature);

        return response()->json([
            'jwt' => $jwt,
            'return_url' => $request->return_url
        ]);
    }

    private function getPrivateKey(): ?string
    {
        $key = env('LTI_PRIVATE_KEY');
        $path = env('LTI_PRIVATE_KEY_PATH');

        if ($path && is_readable($path)) {
            return file_get_contents($path);
        }

        return $key ? str_replace('\n', "\n", $key) : null;
    }

    private function getPublicKey(): ?string
    {
        $key = env('LTI_PUBLIC_KEY');
        $path = env('LTI_PUBLIC_KEY_PATH');

        if ($path && is_readable($path)) {
            return file_get_contents($path);
        }

        if ($key) {
            return str_replace('\n', "\n", $key);
        }

        $privateKey = $this->getPrivateKey();
        if (!$privateKey) {
            return null;
        }

        $details = openssl_pkey_get_details(openssl_pkey_get_private($privateKey));
        return $details['key'] ?? null;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
