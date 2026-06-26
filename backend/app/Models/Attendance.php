<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Attendance extends Model
{
    use HasUuids;
    protected $table = 'attendance';
    protected $fillable = ['tenant_id', 'course_id', 'user_id', 'date', 'status', 'remarks'];
    protected $casts = ['date' => 'date'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function course() { return $this->belongsTo(Course::class); }
    public function user() { return $this->belongsTo(User::class); }
}
