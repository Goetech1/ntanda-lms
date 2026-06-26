<?php
namespace App\Http\Controllers;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request) { return response()->json(Department::where('tenant_id', $request->user()->tenant_id)->get()); }
    public function store(Request $request)
    {
        $request->validate(['institutionId' => 'required|uuid', 'name' => 'required', 'code' => 'required']);
        return response()->json(Department::create(['tenant_id' => $request->user()->tenant_id, 'institution_id' => $request->institutionId, 'name' => $request->name, 'code' => $request->code, 'description' => $request->description]), 201);
    }
    public function show(Request $request, string $id) { return response()->json(Department::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()); }
    public function update(Request $request, string $id) { $d = Department::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail(); $d->update($request->only(['name', 'code', 'description'])); return response()->json($d); }
    public function destroy(Request $request, string $id) { Department::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete(); return response()->json(['success' => true]); }
}
