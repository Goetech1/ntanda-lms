<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::where(function($q) use ($request) {
            $q->where('tenant_id', $request->user()->tenant_id)
              ->orWhereNull('tenant_id');
        });

        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $query->where('name', '!=', 'SUPER_ADMIN');
        }

        return response()->json($query->with('permissions')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        
        // Prevent non-super admin from creating a SUPER_ADMIN role
        if ($request->user()->role->name !== 'SUPER_ADMIN' && strtoupper($request->name) === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $role = Role::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => strtoupper($request->name),
            'description' => $request->description
        ]);

        if ($request->permissionIds) {
            $role->permissions()->sync($request->permissionIds);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function show(Request $request, string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        if ($request->user()->role->name !== 'SUPER_ADMIN' && $role->name === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        return response()->json($role);
    }

    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        if ($request->user()->role->name !== 'SUPER_ADMIN' && $role->name === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required'
        ]);

        $role->update($request->only(['name', 'description']));

        if ($request->permissionIds) {
            $role->permissions()->sync($request->permissionIds);
        }

        return response()->json($role->load('permissions'));
    }

    public function assignPermissions(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        if ($request->user()->role->name !== 'SUPER_ADMIN' && $role->name === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $validated = $request->validate([
            'permissionIds' => 'sometimes|array',
            'permissionIds.*' => 'uuid|exists:permissions,id',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'uuid|exists:permissions,id',
        ]);

        $permissionIds = $validated['permissionIds'] ?? $validated['permissions'] ?? [];
        $role->permissions()->sync($permissionIds);

        return response()->json($role->load('permissions'));
    }

    public function destroy(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        if ($request->user()->role->name !== 'SUPER_ADMIN' && $role->name === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $role->delete();
        return response()->json(['success' => true]);
    }
}
