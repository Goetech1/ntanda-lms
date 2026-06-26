<?php
namespace App\Http\Controllers;
use App\Models\StudentProfile;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request) { return response()->json(StudentProfile::where('tenant_id', $request->user()->tenant_id)->with('user:id,full_name,email')->get()); }
    public function store(Request $request)
    {
        $request->validate(['userId' => 'required|uuid']);
        return response()->json(StudentProfile::create(['tenant_id' => $request->user()->tenant_id, 'user_id' => $request->userId, 'student_id_string' => $request->studentIdString, 'date_of_birth' => $request->dateOfBirth, 'emergency_contact' => $request->emergencyContact, 'address' => $request->address]), 201);
    }
    public function show(Request $request, string $id) { return response()->json(StudentProfile::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('user:id,full_name,email')->firstOrFail()); }
    public function update(Request $request, string $id) { $p = StudentProfile::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail(); $p->update($request->only(['student_id_string', 'date_of_birth', 'emergency_contact', 'address', 'gpa'])); return response()->json($p); }
}
