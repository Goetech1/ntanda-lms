<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class InstructorProfile extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'user_id', 'bio', 'expertise', 'qualifications', 'teaching_subjects', 'rating', 'total_students'];
    protected $casts = ['expertise' => 'array', 'qualifications' => 'array', 'teaching_subjects' => 'array', 'rating' => 'decimal:2'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
}
