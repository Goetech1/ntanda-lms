<?php
namespace App\Http\Controllers;
use App\Models\Institution;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(Institution::where('tenant_id', $request->user()->tenant_id)->firstOrFail());
    }

    public function update(Request $request)
    {
        $inst = Institution::where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $inst->update($request->only(['name', 'address', 'contact_email', 'contact_phone', 'motto', 'settings']));
        return response()->json($inst);
    }
}
