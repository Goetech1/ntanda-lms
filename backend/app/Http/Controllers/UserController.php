<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('tenant_id', $request->user()->tenant_id)->with('role');

        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $query->whereHas('role', function ($q) {
                $q->where('name', '!=', 'SUPER_ADMIN');
            });
        }

        $users = $query->get()->makeHidden('password_hash');
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'fullName' => 'required|string',
            'roleId' => 'required|uuid',
        ]);

        $tenantId = $request->user()->tenant_id;
        if (User::where('email', $request->email)->where('tenant_id', $tenantId)->exists()) {
            return response()->json(['message' => 'User with this email already exists in the tenant'], 409);
        }

        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $roleToAssign = \App\Models\Role::find($request->roleId);
            if ($roleToAssign && $roleToAssign->name === 'SUPER_ADMIN') {
                return response()->json(['message' => 'Unauthorized to assign SUPER_ADMIN role'], 403);
            }
        }

        $user = User::create([
            'tenant_id' => $tenantId,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'full_name' => $request->fullName,
            'role_id' => $request->roleId,
            'avatar_url' => $request->avatarUrl,
        ]);

        $user->load('role');
        return response()->json($user->makeHidden('password_hash'), 201);
    }

    public function show(Request $request, string $id)
    {
        $query = User::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('role');
        
        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $query->whereHas('role', function ($q) {
                $q->where('name', '!=', 'SUPER_ADMIN');
            });
        }
        
        $user = $query->firstOrFail();
        return response()->json($user->makeHidden('password_hash'));
    }

    public function update(Request $request, string $id)
    {
        $query = User::where('id', $id)->where('tenant_id', $request->user()->tenant_id);
        
        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $query->whereHas('role', function ($q) {
                $q->where('name', '!=', 'SUPER_ADMIN');
            });
        }
        
        $user = $query->firstOrFail();
        
        $data = $request->only(['email', 'full_name', 'fullName', 'role_id', 'roleId', 'avatar_url', 'avatarUrl']);
        if ($request->has('fullName')) $data['full_name'] = $request->fullName;
        
        if ($request->has('roleId')) {
            if ($request->user()->role->name !== 'SUPER_ADMIN') {
                $roleToAssign = \App\Models\Role::find($request->roleId);
                if ($roleToAssign && $roleToAssign->name === 'SUPER_ADMIN') {
                    return response()->json(['message' => 'Unauthorized to assign SUPER_ADMIN role'], 403);
                }
            }
            $data['role_id'] = $request->roleId;
        }
        if ($request->has('avatarUrl')) $data['avatar_url'] = $request->avatarUrl;
        if ($request->has('password')) $data['password_hash'] = Hash::make($request->password);
        $user->update($data);
        $user->load('role');
        return response()->json($user->makeHidden('password_hash'));
    }

    public function destroy(Request $request, string $id)
    {
        $query = User::where('id', $id)->where('tenant_id', $request->user()->tenant_id);
        
        if ($request->user()->role->name !== 'SUPER_ADMIN') {
            $query->whereHas('role', function ($q) {
                $q->where('name', '!=', 'SUPER_ADMIN');
            });
        }
        
        $user = $query->firstOrFail();
        $user->delete();
        return response()->json(['success' => true]);
    }
}
