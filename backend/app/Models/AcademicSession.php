<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AcademicSession extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'institution_id', 'name', 'start_date', 'end_date', 'is_active'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'is_active' => 'boolean'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function institution() { return $this->belongsTo(Institution::class); }
}
