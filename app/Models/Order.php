<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'status', 'date_order'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
