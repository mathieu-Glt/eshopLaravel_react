<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressUser extends Model
{
    protected $fillable = ['user_id', 'address', 'city', 'zip_code', 'country'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
