<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpeditionOrder extends Model
{
    protected $fillable = ['order_id', 'transporter', 'expedition_status', 'expedition_date', 'suivi_number'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
