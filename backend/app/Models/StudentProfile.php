<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StudentProfile extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'user_id', 'student_id_string', 'date_of_birth', 'emergency_contact', 'address', 'gpa'];
    protected $casts = ['date_of_birth' => 'date', 'emergency_contact' => 'array', 'gpa' => 'decimal:2'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
}
