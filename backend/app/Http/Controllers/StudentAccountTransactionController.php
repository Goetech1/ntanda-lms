<?php

namespace App\Http\Controllers;

use App\Models\StudentAccountTransaction;
use Illuminate\Http\Request;

class StudentAccountTransactionController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $role = $request->user()->role?->name;

        $query = StudentAccountTransaction::where('tenant_id', $tenantId)
            ->with(['student:id,full_name,email', 'studentPayment.paymentMethod']);

        if (!in_array($role, ['ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'], true)) {
            $query->where('student_id', $request->user()->id);
        }

        return response()->json($query->orderByDesc('posted_at')->orderByDesc('created_at')->get());
    }
}
