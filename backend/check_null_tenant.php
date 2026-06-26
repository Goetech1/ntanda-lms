<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = User::whereNull('tenant_id')->get();
echo "Users with null tenant_id: " . $users->count() . "\n";
foreach ($users as $u) {
    echo " - {$u->email} (Role: {$u->role->name})\n";
}
