<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PoliceOfficer extends Model
{
    protected $table = 'police_officers';
    protected $primaryKey = 'officer_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'full_name',
        'badge_number',
        'rank',
        'police_station',
        'phone',
        'joined_date',
        'device_token',
        'is_online',
        'last_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
