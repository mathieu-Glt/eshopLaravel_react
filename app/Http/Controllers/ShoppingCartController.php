<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShopingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller
{
    /**
     * Ajoute un produit au panier de l'utilisateur
     * 
     * @param Request $request La requête contenant l'ID du produit et la quantité
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToCart(Request $request)
    {
        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);

        $cartItem = ShopingCart::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
        } else {
            $cartItem = new ShopingCart();
            $cartItem->user_id = $user->id;
            $cartItem->product_id = $product->id;
            $cartItem->quantity = $request->quantity;
        }

        $cartItem->save();
        return response()->json(['message' => 'Produit ajouté au panier avec succès']);
    }

    /**
     * Supprime un produit du panier de l'utilisateur
     * 
     * @param Request $request La requête contenant l'ID du produit à supprimer
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFromCart(Request $request)
    {
        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);

        $cartItem = ShopingCart::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return response()->json(['message' => 'Produit supprimé du panier avec succès']);
    }

    /**
     * Récupère tous les produits du panier de l'utilisateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCartItems()
    {
        $user = Auth::user();
        $cartItems = ShopingCart::where('user_id', $user->id)->get();
        return response()->json($cartItems);
    }

    /**
     * Vide le panier de l'utilisateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearCart()
    {
        $user = Auth::user();
        ShopingCart::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Panier vidé avec succès']);
    }
}
