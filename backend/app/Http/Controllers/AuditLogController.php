<?php
namespace App\Http\Controllers;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request) { return response()->json(AuditLog::where('tenant_id', $request->user()->tenant_id)->orderBy('created_at', 'desc')->limit(100)->get()); }
}
