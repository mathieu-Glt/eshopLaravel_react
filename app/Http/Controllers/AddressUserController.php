<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AddressUser;

/**
 * AddressUserController
 * 
 * Gère toutes les opérations liées aux adresses des utilisateurs
 */
class AddressUserController extends Controller
{
    /**
     * Ajoute une nouvelle adresse pour l'utilisateur authentifié
     * 
     * @param Request $request La requête contenant :
     *                         - address : L'adresse complète
     *                         - city : La ville
     *                         - zip_code : Le code postal
     *                         - country : Le pays
     * @return \Illuminate\Http\JsonResponse
     */
    public function addAddress(Request $request)
    {
        $user = Auth::user();
        $address = new AddressUser();
        $address->user_id = $user->id;
        $address->address = $request->address;
        $address->city = $request->city;
        $address->zip_code = $request->zip_code;
        $address->country = $request->country;
        $address->save();

        return response()->json(['message' => 'Adresse ajoutée avec succès']);
    }

    /**
     * Supprime une adresse spécifique de l'utilisateur authentifié
     * 
     * @param Request $request La requête contenant :
     *                         - id : L'ID de l'adresse à supprimer
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeAddress(Request $request)
    {
        $user = Auth::user();
        $address = AddressUser::where('user_id', $user->id)->where('id', $request->id)->first();
        $address->delete();
        return response()->json(['message' => 'Adresse supprimée avec succès']);
    }

    /**
     * Récupère toutes les adresses de l'utilisateur authentifié
     * 
     * @return \Illuminate\Http\JsonResponse Liste des adresses
     */
    public function getAddresses()
    {
        $user = Auth::user();
        $addresses = AddressUser::where('user_id', $user->id)->get();
        return response()->json($addresses);
    }

    /**
     * Supprime toutes les adresses de l'utilisateur authentifié
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearAddresses()
    {
        $user = Auth::user();
        AddressUser::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Adresses supprimées avec succès']);
    }

    /**
     * Met à jour une adresse existante de l'utilisateur authentifié
     * 
     * @param Request $request La requête contenant :
     *                         - id : L'ID de l'adresse à mettre à jour
     *                         - address : La nouvelle adresse
     *                         - city : La nouvelle ville
     *                         - zip_code : Le nouveau code postal
     *                         - country : Le nouveau pays
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAddress(Request $request)
    {
        $user = Auth::user();
        $address = AddressUser::where('user_id', $user->id)->where('id', $request->id)->first();
        $address->address = $request->address;
        $address->city = $request->city;
        $address->zip_code = $request->zip_code;
        $address->country = $request->country;
        $address->save();
        return response()->json(['message' => 'Adresse mise à jour avec succès']);
    }
}
