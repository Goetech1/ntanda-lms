<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Tenant;

$user = User::where('email', 'admin@ntanda.com')->first();
echo "User tenant_id: " . ($user->tenant_id ?? 'NULL') . "\n";
if ($user && $user->tenant_id) {
    $tenant = Tenant::find($user->tenant_id);
    echo "Tenant found: " . ($tenant ? 'YES' : 'NO') . "\n";
}
