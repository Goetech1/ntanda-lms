<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Forum extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'course_id',
        'title',
        'description'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function posts()
    {
        return $this->hasMany(ForumPost::class)->whereNull('parent_id');
    }

    public function allPosts()
    {
        return $this->hasMany(ForumPost::class);
    }
}
