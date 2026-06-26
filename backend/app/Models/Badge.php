<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Badge extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'title',
        'description',
        'icon_name',
        'course_id',
        'learning_path_id'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class, 'learning_path_id');
    }

    public function awards()
    {
        return $this->hasMany(BadgeAward::class);
    }
}
