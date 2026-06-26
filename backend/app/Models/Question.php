<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Question extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'assessment_id',
        'category_id',
        'type',
        'text',
        'content',
        'options',
        'correct_answer',
        'options_json',
        'answer_json',
        'points',
        'order_index',
    ];
    
    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'array',
        'options_json' => 'array',
        'answer_json' => 'array',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function assessment() { return $this->belongsTo(Assessment::class); }
    public function category() { return $this->belongsTo(QuestionCategory::class, 'category_id'); }
}
