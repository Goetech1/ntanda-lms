<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Lesson extends Model
{
    use HasUuids;
    
    protected $fillable = [
        'tenant_id', 
        'module_id', 
        'title', 
        'content', 
        'video_url', 
        'media_type', 
        'document_url', 
        'duration_minutes', 
        'is_preview', 
        'order_index'
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'duration_minutes' => 'integer',
        'order_index' => 'integer',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function module() { return $this->belongsTo(CourseModule::class, 'module_id'); }
}
