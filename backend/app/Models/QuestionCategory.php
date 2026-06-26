<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuestionCategory extends Model
{
    use HasUuids;

    protected $fillable = ['tenant_id', 'name'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function questions() { return $this->hasMany(Question::class, 'category_id'); }
}
