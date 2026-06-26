<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Certificate::where('tenant_id', $request->user()->tenant_id)->where('user_id', $request->user()->id)->with('course:id,title')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'certificateUrl' => 'required|string']);
        return response()->json(Certificate::create([
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->user()->id,
            'course_id' => $request->courseId,
            'certificate_url' => $request->certificateUrl,
            'validation_code' => strtoupper(Str::random(12)),
        ]), 201);
    }

    public function validate(Request $request, string $code)
    {
        $cert = Certificate::where('validation_code', $code)->with(['user:id,full_name', 'course:id,title'])->first();
        if (!$cert) return response()->json(['valid' => false, 'message' => 'Certificate not found'], 404);
        return response()->json(['valid' => true, 'certificate' => $cert]);
    }
}
