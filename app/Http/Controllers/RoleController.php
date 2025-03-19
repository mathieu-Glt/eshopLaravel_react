<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Récupère les rôles d'un utilisateur par son ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserRoles($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $roles = $user->getRoleNames();

        return response()->json([
            'user' => $user,
            'roles' => $roles
        ]);
    }
}
