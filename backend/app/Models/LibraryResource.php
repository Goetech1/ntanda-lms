<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class LibraryResource extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'uploaded_by',
        'title',
        'description',
        'resource_type',
        'file_url',
        'external_url',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
}
