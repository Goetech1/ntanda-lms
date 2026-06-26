<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::where('email', 'admin@ntanda.com')->first();
echo "User ID: {$user->id}\n";
echo "User Tenant ID: {$user->tenant_id}\n";

$tenant = $user->tenant;
if ($tenant) {
    echo "Tenant Relation Loaded: YES\n";
    echo "Tenant Name: {$tenant->name}\n";
} else {
    echo "Tenant Relation Loaded: NO\n";
}
