<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * AuthController
 * 
 * Gère l'authentification et l'autorisation des utilisateurs
 */
class AuthController extends Controller
{
    /**
     * Enregistre un nouvel utilisateur
     * 
     * @param Request $request La requête contenant :
     *                         - name : Nom de l'utilisateur
     *                         - email : Email de l'utilisateur (unique)
     *                         - password : Mot de passe (min 8 caractères)
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException Si les données sont invalides
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // asigne role user par default 
        // Assigne le rôle 'user' par défaut
        try {
            $user->assignRole('user');
            Log::info('Role "user" assigné à l\'utilisateur: ' . $user->id);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'assignation du rôle "user": ' . $e->getMessage());
        }
        // $user = new User([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password)
        // ]);

        // $user->save();

        // Récupère les rôles de l'utilisateur
        $roles = $user->getRoleNames();

        return response()->json([
            'message' => 'Inscription ok',
            'user' => $user,
            'roles' => $roles
        ]);        // }
    }

    /**
     * Authentifie un utilisateur
     * 
     * @param Request $request La requête contenant :
     *                         - email : Email de l'utilisateur
     *                         - password : Mot de passe
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException Si les identifiants sont incorrects
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8'
        ]);

        $user = User::where('email', $request->email)->first();
        Log::info('User found: ' . $user);

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        Log::info('User found: ' . $user);
        $token = $user->createToken('authToken')->plainTextToken;
        // Vérification avec un log 
        Log::info('Token generated: ' . $token);
        // $cookie = cookie('token', $token, 60 * 24);


        // $credentials = $request->only('email', 'password');
        // Récupère les rôles de l'utilisateur
        $roles = $user->getRoleNames();
        Log::info('User roles: ' . $roles);
        return response()->json([
            'user' => $user,
            'token' => $token,
            'roles' => $roles
        ]);
        // if (auth()->attempt($credentials)) {
        //     $user = auth()->user();
        //     return response()->json([
        //         'user' => $user,
        //         'access_token' => $token,
        //         'token_type' => 'Bearer'
        //     ]);
        // } else {
        //     return response()->json([
        //         'message' => 'Unauthorized'
        //     ], 401);
        // }
    }

    /**
     * Déconnecte l'utilisateur actuel
     * 
     * @param Request $request La requête contenant le token d'authentification
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        // $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Deconnected ok'
        ]);
    }

    /**
     * Récupère les informations de l'utilisateur authentifié
     * 
     * @param Request $request La requête contenant le token d'authentification
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception Si l'utilisateur n'est pas authentifié
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user();
            Log::info('Tentative d\'accès aux informations utilisateur', ['user_id' => $user?->id]);

            if (!$user) {
                Log::warning('Tentative d\'accès non autorisée aux informations utilisateur');
                return response()->json([
                    "error" => "Utilisateur non authentifié"
                ], 401);
            }

            Log::info('Informations utilisateur récupérées avec succès', ['user_id' => $user->id]);

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des informations utilisateur', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id
            ]);

            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des informations'
            ], 500);
        }
    }
}