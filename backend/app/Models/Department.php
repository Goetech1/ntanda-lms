<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Department extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'institution_id', 'name', 'code', 'description'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function institution() { return $this->belongsTo(Institution::class); }
}
