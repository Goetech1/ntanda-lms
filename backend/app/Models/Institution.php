<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Institution extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'name', 'address', 'contact_email', 'contact_phone', 'motto', 'settings'];
    protected $casts = ['settings' => 'array'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function departments() { return $this->hasMany(Department::class); }
    public function academicSessions() { return $this->hasMany(AcademicSession::class); }
}
