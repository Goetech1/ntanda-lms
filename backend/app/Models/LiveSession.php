<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LiveSession extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id', 'course_id', 'title', 'description', 
        'provider', 'meeting_url', 'start_time', 
        'duration_minutes', 'status'
    ];

    protected $casts = [
        'start_time' => 'datetime',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
