<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Tenant;
use App\Models\Institution;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seed...');

        // ─── Permissions ────────────────────────────────────────────────────────────
        $permDefs = [
            ['action' => 'CREATE', 'resource' => 'users'],
            ['action' => 'READ_USER', 'resource' => 'users'],
            ['action' => 'UPDATE_USER', 'resource' => 'users'],
            ['action' => 'DELETE_USER', 'resource' => 'users'],
            ['action' => 'CREATE_COURSE', 'resource' => 'courses'],
            ['action' => 'READ_COURSE', 'resource' => 'courses'],
            ['action' => 'UPDATE_COURSE', 'resource' => 'courses'],
            ['action' => 'DELETE_COURSE', 'resource' => 'courses'],
            ['action' => 'ENROLL_COURSE', 'resource' => 'enrollments'],
            ['action' => 'READ_ENROLLMENT', 'resource' => 'enrollments'],
            ['action' => 'UPDATE_ENROLLMENT_PROGRESS', 'resource' => 'enrollments'],
            ['action' => 'READ_ANALYTICS', 'resource' => 'analytics'],
            ['action' => 'READ_PAYMENTS', 'resource' => 'payments'],
            ['action' => 'UPDATE_PAYMENT', 'resource' => 'payments'],
            ['action' => 'MANAGE_SUBSCRIPTIONS', 'resource' => 'subscriptions'],
            ['action' => 'CREATE_ASSESSMENT', 'resource' => 'assessments'],
            ['action' => 'READ_ASSESSMENT', 'resource' => 'assessments'],
            ['action' => 'MANAGE_CONTENT', 'resource' => 'content'],
        ];

        $createdPerms = [];
        foreach ($permDefs as $def) {
            $p = Permission::firstOrCreate(
                ['action' => $def['action'], 'resource' => $def['resource']]
            );
            $createdPerms[] = $p;
            $this->command->info("  ✓ Permission: {$p->action}_{$p->resource}");
        }

        $allPermIds = collect($createdPerms)->pluck('id')->toArray();
        $instructorActions = ['CREATE_COURSE', 'READ_COURSE', 'UPDATE_COURSE', 'READ_ENROLLMENT', 'CREATE_ASSESSMENT', 'READ_ASSESSMENT', 'MANAGE_CONTENT'];
        $studentActions = ['ENROLL_COURSE', 'READ_COURSE', 'UPDATE_ENROLLMENT_PROGRESS', 'READ_ASSESSMENT'];

        $instructorPermIds = collect($createdPerms)
            ->filter(fn($p) => in_array($p->action, $instructorActions))
            ->pluck('id')->toArray();
            
        $studentPermIds = collect($createdPerms)
            ->filter(fn($p) => in_array($p->action, $studentActions))
            ->pluck('id')->toArray();
            
        $financeOfficerActions = ['READ_PAYMENTS', 'UPDATE_PAYMENT'];
        $financeOfficerPermIds = collect($createdPerms)
            ->filter(fn($p) => in_array($p->action, $financeOfficerActions))
            ->pluck('id')->toArray();

        // ─── System Roles (tenantId = null → shared across platform) ────────────────
        $superAdminRole = $this->upsertRole('SUPER_ADMIN', 'Global system control', $allPermIds);
        $this->command->info("\n  ✓ Role: SUPER_ADMIN");

        $adminRole = $this->upsertRole('ADMIN', 'Institution administrator', $allPermIds);
        $this->command->info("  ✓ Role: ADMIN");

        $instructorRole = $this->upsertRole('INSTRUCTOR', 'Course instructor', $instructorPermIds);
        $this->command->info("  ✓ Role: INSTRUCTOR");

        $studentRole = $this->upsertRole('STUDENT', 'Enrolled student', $studentPermIds);
        $this->command->info("  ✓ Role: STUDENT");

        $financeOfficerRole = $this->upsertRole('FINANCE_OFFICER', 'Institution Finance Officer', $financeOfficerPermIds);
        $this->command->info("  ✓ Role: FINANCE_OFFICER");

        // ─── Demo Tenant ────────────────────────────────────────────────────────────
        $tenant = Tenant::firstOrCreate(
            ['subdomain' => 'ntanda-demo'],
            [
                'id' => '019ea23e-d663-723b-85d3-b199a01a7bb4', // Forced to match VITE_TENANT_ID
                'name' => 'Ntanda Demo Academy',
                'domain' => 'demo.ntanda.com',
                'status' => 'ACTIVE',
                'branding' => ['primaryColor' => '#2563eb', 'logoUrl' => ''],
            ]
        );
        
        // If the tenant exists but had a different ID (which shouldn't happen for the first one), 
        // we enforce the ID update if possible, or we just rely on firstOrCreate for fresh seeds.
        if ($tenant->id !== '019ea23e-d663-723b-85d3-b199a01a7bb4') {
            $tenant->id = '019ea23e-d663-723b-85d3-b199a01a7bb4';
            $tenant->save();
        }
        $this->command->info("\n  ✓ Tenant: {$tenant->name}");
        $this->command->info("    Tenant ID: {$tenant->id}");

        // ─── Users ───────────────────────────────────────────────────────────────────
        $pw = Hash::make('Admin1234!');

        $users = [
            ['email' => 'admin@ntanda.com', 'fullName' => 'Super Admin', 'roleId' => $superAdminRole->id],
            ['email' => 'schooladmin@ntanda.com', 'fullName' => 'School Admin', 'roleId' => $adminRole->id],
            ['email' => 'instructor@ntanda.com', 'fullName' => 'Demo Instructor', 'roleId' => $instructorRole->id],
            ['email' => 'student@ntanda.com', 'fullName' => 'Demo Student', 'roleId' => $studentRole->id],
            ['email' => 'finance@ntanda.com', 'fullName' => 'Demo Finance Officer', 'roleId' => $financeOfficerRole->id],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(
                ['tenant_id' => $tenant->id, 'email' => $u['email']],
                [
                    'password_hash' => $pw,
                    'full_name' => $u['fullName'],
                    'role_id' => $u['roleId'],
                ]
            );
            $this->command->info("  ✓ User: {$u['email']} [{$u['fullName']}]");
        }

        // ─── Demo Institution ────────────────────────────────────────────────────────
        Institution::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'name' => 'Ntanda Demo Academy',
                'contact_email' => 'info@ntanda.com',
                'contact_phone' => '+2348000000000',
                'address' => '1 Demo Street, Lagos, Nigeria',
                'settings' => [],
            ]
        );
        $this->command->info("  ✓ Institution created");

        $this->command->info("\n────────────────────────────────────────────────────");
        $this->command->info("✅ Seed complete! Ready to use.\n");
        $this->command->info("  Tenant ID (use as x-tenant-id header): {$tenant->id}");
        $this->command->info("\n  Login credentials (password: Admin1234!):");
        $this->command->info("    admin@ntanda.com        → SUPER_ADMIN");
        $this->command->info("    schooladmin@ntanda.com  → ADMIN");
        $this->command->info("    finance@ntanda.com      → FINANCE_OFFICER");
        $this->command->info("    instructor@ntanda.com   → INSTRUCTOR");
        $this->command->info("    student@ntanda.com      → STUDENT");
        $this->command->info("────────────────────────────────────────────────────\n");
    }

    private function upsertRole(string $name, string $description, array $permIds)
    {
        $role = Role::firstOrCreate(
            ['name' => $name, 'tenant_id' => null],
            ['description' => $description, 'is_system' => true]
        );
        
        $role->permissions()->sync($permIds);
        
        return $role;
    }
}
