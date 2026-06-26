<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BulkImportController extends Controller
{
    public function importUsers(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'users.*.first_name' => 'required|string',
            'users.*.last_name' => 'required|string',
            'users.*.email' => 'required|email',
            'users.*.role' => 'required|string'
        ]);

        $tenantId = $request->user()->tenant_id;
        $usersToImport = $request->users;

        $successCount = 0;
        $errors = [];

        foreach ($usersToImport as $index => $userData) {
            $email = strtolower(trim($userData['email']));
            
            // Check if user exists (Globally or within Tenant based on your isolation model)
            // Assuming strict tenant isolation here, but emails usually are unique globally.
            $exists = DB::table('users')->where('email', $email)->exists();

            if ($exists) {
                $errors[] = "Row " . ($index + 1) . ": Email {$email} already exists.";
                continue;
            }

            try {
                $userId = Str::uuid();
                
                DB::table('users')->insert([
                    'id' => $userId,
                    'tenant_id' => $tenantId,
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'email' => $email,
                    'password' => Hash::make('Ntanda2026!'), // Default password
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Attach Role
                $roleName = strtolower(trim($userData['role']));
                $role = DB::table('roles')->where('name', $roleName)->where(function($query) use ($tenantId) {
                    $query->where('tenant_id', $tenantId)->orWhereNull('tenant_id');
                })->first();

                if ($role) {
                    DB::table('role_user')->insert([
                        'user_id' => $userId,
                        'role_id' => $role->id,
                    ]);
                }

                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 1) . ": System error processing {$email}.";
            }
        }

        return response()->json([
            'message' => 'Import complete.',
            'success_count' => $successCount,
            'errors' => $errors
        ]);
    }
}
