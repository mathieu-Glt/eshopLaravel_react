<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        try {
            Log::info('Tentative de récupération des utilisateurs', [
                'user' => Auth::user(),
                'roles' => Auth::user() ? Auth::user()->getRoleNames() : []
            ]);

            $users = User::with('roles')->get();

            Log::info('Utilisateurs récupérés avec succès', [
                'count' => $users->count(),
                'users' => $users->toArray()
            ]);

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des utilisateurs', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Erreur lors de la récupération des utilisateurs'], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}