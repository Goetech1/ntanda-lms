<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TenantController extends Controller
{
    public function index() { return response()->json(Tenant::all()); }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'domain' => 'required|unique:tenants', 'subdomain' => 'required|unique:tenants']);
        return response()->json(Tenant::create($request->only(['name', 'domain', 'subdomain', 'status', 'branding'])), 201);
    }

    public function show(string $id) { return response()->json(Tenant::findOrFail($id)); }

    public function update(Request $request, string $id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->update($request->only(['name', 'domain', 'subdomain', 'status', 'branding']));
        return response()->json($tenant);
    }

    public function destroy(string $id)
    {
        Tenant::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // Public endpoint - resolve tenant by subdomain/domain
    public function resolve(Request $request)
    {
        $subdomain = $request->query('subdomain');
        $domain = $request->query('domain');

        $lookup = $domain ?: $subdomain;

        if (!$lookup) {
            return response()->json(['message' => 'Tenant lookup value is required'], 422);
        }

        $lookup = strtolower(trim($lookup));
        $rootDomain = str_starts_with($lookup, 'www.') ? substr($lookup, 4) : $lookup;
        $firstLabel = explode('.', $rootDomain)[0] ?? $rootDomain;

        $tenant = Tenant::query()
            ->where('id', $lookup)
            ->orWhere(DB::raw('LOWER(subdomain)'), $lookup)
            ->orWhere(DB::raw('LOWER(subdomain)'), $firstLabel)
            ->orWhere(DB::raw('LOWER(domain)'), $lookup)
            ->orWhere(DB::raw('LOWER(domain)'), $rootDomain)
            ->first();

        if (!$tenant) return response()->json(['message' => 'Tenant not found'], 404);

        return response()->json($tenant);
    }

    // Get currently authenticated user's tenant profile
    public function currentTenant(Request $request)
    {
        $user = $request->user();
        \Log::info('currentTenant accessed', ['user_id' => $user->id, 'tenant_id' => $user->tenant_id]);
        $tenant = $user->tenant;
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found', 'user_id' => $user->id], 404);
        }
        return response()->json($tenant);
    }

    // Update currently authenticated user's tenant profile
    public function updateCurrentTenant(Request $request)
    {
        $user = $request->user();
        if ($user->role->name !== 'ADMIN' && $user->role->name !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized. Only admins can modify tenant settings.'], 403);
        }

        $tenant = $user->tenant;
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'branding' => 'sometimes|array',
            'domain' => 'sometimes|string',
            'subdomain' => 'sometimes|string'
        ]);

        $tenant->update($request->only(['name', 'branding', 'domain', 'subdomain']));
        return response()->json($tenant);
    }
}
