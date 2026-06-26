<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PeerReview extends Model
{
    use HasUuids;

    protected $fillable = ['assignment_id', 'reviewer_id', 'reviewee_id', 'score', 'feedback'];

    public function assignment() { return $this->belongsTo(Lesson::class, 'assignment_id'); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewer_id'); }
    public function reviewee() { return $this->belongsTo(User::class, 'reviewee_id'); }
}
