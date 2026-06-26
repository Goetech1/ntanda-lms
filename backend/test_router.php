<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/auth/login', 'POST', [
    'email' => 'admin@ntanda.com',
    'password' => 'Admin1234!'
]);
$request->headers->set('Accept', 'application/json');
$request->headers->set('x-tenant-id', '019ea23e-d663-723b-85d3-b199a01a7bb4');

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
