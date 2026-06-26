<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasUuids;

    protected $table = 'chat_conversations';
    protected $fillable = ['tenant_id'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
}
