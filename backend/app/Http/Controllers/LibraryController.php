<?php
namespace App\Http\Controllers;
use App\Models\LibraryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $query = LibraryResource::where('tenant_id', $request->user()->tenant_id)
            ->with('uploader:id,full_name,email')
            ->orderBy('created_at', 'desc');

        if ($request->filled('resource_type')) {
            $query->where('resource_type', $request->query('resource_type'));
        }

        return response()->json(['resources' => $query->get()]);
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'resourceType' => 'nullable|string|max:50',
            'resource_type' => 'nullable|string|max:50',
            'externalUrl' => 'nullable|url',
            'external_url' => 'nullable|url',
            'file' => 'nullable|file|max:51200',
            'metadata' => 'nullable|array',
        ]);

        $fileUrl = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('library-resources', 'public');
            $fileUrl = Storage::disk('public')->url($path);
        }

        $resource = LibraryResource::create([
            'tenant_id' => $request->user()->tenant_id,
            'uploaded_by' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'resource_type' => $validated['resource_type'] ?? $validated['resourceType'] ?? 'document',
            'file_url' => $fileUrl,
            'external_url' => $validated['external_url'] ?? $validated['externalUrl'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
        ]);

        return response()->json(['success' => true, 'resource' => $resource], 201);
    }
}
