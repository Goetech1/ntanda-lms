<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizQuestion extends Model
{
    use HasUuids;

    protected $fillable = ['quiz_id', 'question_id', 'points'];

    public function quiz() { return $this->belongsTo(Lesson::class, 'quiz_id'); }
    public function question() { return $this->belongsTo(Question::class); }
}
