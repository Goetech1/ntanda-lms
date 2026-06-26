<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Certificate extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'user_id', 'course_id', 'issued_at', 'certificate_url', 'validation_code'];
    protected $casts = ['issued_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
