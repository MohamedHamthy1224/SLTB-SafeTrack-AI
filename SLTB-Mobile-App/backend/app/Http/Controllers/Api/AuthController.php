<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Authenticate Officer credentials against MySQL safe_track_ai_db
     */
    public function login(Request $request)
    {
        // 1. Accept 'login' (or 'email' / 'username') and 'password'
        $loginInput = trim($request->input('login') ?? $request->input('email') ?? $request->input('username') ?? '');
        $password = (string) $request->input('password', '');

        if (empty($loginInput)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Username',
                'errors' => ['login' => ['Please enter your email or username.']]
            ], 422);
        }

        if (empty($password)) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect Password',
                'errors' => ['password' => ['Please enter your password.']]
            ], 422);
        }

        // 2. Find user in MySQL 'users' table by email OR username
        $user = User::with(['policeOfficer', 'role'])
            ->where(function ($query) use ($loginInput) {
                $query->where('email', $loginInput)
                      ->orWhere('username', $loginInput);
            })->first();

        // 3. Handle non-existent user
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Username',
                'errors' => ['login' => ['No account found matching this email or username.']]
            ], 401);
        }

        // 4. Handle inactive status
        if ($user->status === 'Inactive') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact system administrator.',
            ], 403);
        }

        // 5. Verify password hash using native PHP password_verify (supports $2b$, $2y$, $2a$ hashes)
        $isValidPassword = false;
        try {
            $isValidPassword = password_verify($password, $user->password);
        } catch (\Throwable $e) {
            $isValidPassword = false;
        }

        if (!$isValidPassword) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect Password',
                'errors' => ['password' => ['The password you entered is incorrect.']]
            ], 401);
        }

        // 6. Update online status if police officer record exists
        if ($user->policeOfficer) {
            try {
                $user->policeOfficer->update([
                    'is_online' => 1,
                    'last_active' => now(),
                ]);
            } catch (\Throwable $e) {
                // Ignore DB update errors if timestamp format differs
            }
        }

        // 7. Generate secure token
        $token = 'sltb_auth_token_' . Str::random(60) . '_' . time();

        // 8. Build officer payload
        $officer = $user->policeOfficer;
        $roleName = $user->role ? $user->role->role_name : 'Traffic Police Officer';

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'user_id'        => $user->user_id,
                'username'       => $user->username,
                'email'          => $user->email,
                'full_name'      => $officer ? $officer->full_name : $user->username,
                'badge_number'   => $officer ? $officer->badge_number : 'TP000',
                'rank'           => $officer ? $officer->rank : 'Officer',
                'police_station' => $officer ? $officer->police_station : 'Traffic Division',
                'phone'          => $officer ? $officer->phone : '',
                'role'           => $roleName,
                'profile_image'  => $user->profile_image,
            ],
        ], 200);
    }
}
