<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CourseCategory extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'name', 'slug', 'description'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function courses() { return $this->hasMany(Course::class, 'category_id'); }
}
