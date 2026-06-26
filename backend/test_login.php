<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'admin@ntanda.com')->first();
echo "User found: " . ($user ? "YES" : "NO") . PHP_EOL;

if ($user) {
    echo "tenant_id: " . $user->tenant_id . PHP_EOL;
    echo "password_hash exists: " . (!empty($user->password_hash) ? "YES" : "NO") . PHP_EOL;
    echo "Hash check Admin1234!: " . (\Illuminate\Support\Facades\Hash::check('Admin1234!', $user->password_hash) ? "PASS" : "FAIL") . PHP_EOL;
    echo "role_id: " . $user->role_id . PHP_EOL;
    echo "role name: " . ($user->role ? $user->role->name : "NO ROLE") . PHP_EOL;
}
