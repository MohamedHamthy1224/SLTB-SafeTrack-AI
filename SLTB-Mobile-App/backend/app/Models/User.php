<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $timestamps = true;

    protected $fillable = [
        'role_id',
        'username',
        'email',
        'password',
        'profile_image',
        'status',
        'theme_preference',
    ];

    protected $hidden = [
        'password',
    ];

    public function policeOfficer()
    {
        return $this->hasOne(PoliceOfficer::class, 'user_id', 'user_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }
}
