<?php
namespace App\Http\Controllers;
use App\Models\AcademicSession;
use Illuminate\Http\Request;

class AcademicSessionController extends Controller
{
    public function index(Request $request) { return response()->json(AcademicSession::where('tenant_id', $request->user()->tenant_id)->get()); }
    public function store(Request $request)
    {
        $request->validate(['institutionId' => 'required|uuid', 'name' => 'required', 'startDate' => 'required|date', 'endDate' => 'required|date']);
        return response()->json(AcademicSession::create(['tenant_id' => $request->user()->tenant_id, 'institution_id' => $request->institutionId, 'name' => $request->name, 'start_date' => $request->startDate, 'end_date' => $request->endDate, 'is_active' => $request->isActive ?? false]), 201);
    }
    public function show(Request $request, string $id) { return response()->json(AcademicSession::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()); }
    public function update(Request $request, string $id) { $s = AcademicSession::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail(); $s->update($request->only(['name', 'start_date', 'end_date', 'is_active'])); return response()->json($s); }
    public function activate(Request $request, string $id)
    {
        $session = AcademicSession::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->firstOrFail();

        AcademicSession::where('tenant_id', $request->user()->tenant_id)
            ->where('institution_id', $session->institution_id)
            ->update(['is_active' => false]);

        $session->update(['is_active' => true]);

        return response()->json($session);
    }
    public function destroy(Request $request, string $id) { AcademicSession::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete(); return response()->json(['success' => true]); }
}
