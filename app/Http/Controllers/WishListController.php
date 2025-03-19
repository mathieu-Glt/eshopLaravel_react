<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\WishList;
use Illuminate\Support\Facades\Log;

class WishListController extends Controller
{
    /**
     * Récupère tous les produits de la liste de souhaits de l'utilisateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $wishListItems = WishList::where('user_id', $user->id)
                ->with('product')
                ->get();
            return response()->json($wishListItems);
        } catch (\Exception $e) {
            Log::error('Error fetching wishlist: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch wishlist'], 500);
        }
    }

    /**
     * Ajoute un produit à la liste de souhaits de l'utilisateur
     * 
     * @param Request $request La requête contenant l'ID du produit
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            Log::info('Starting store method', ['request' => $request->all()]);

            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            Log::info('User authenticated', ['user_id' => $user->id]);

            $productId = $request->input('product_id');
            if (!$productId) {
                Log::error('Product ID not provided');
                return response()->json(['error' => 'Product ID is required'], 400);
            }

            Log::info('Product ID received', ['product_id' => $productId]);

            // Vérifier si le produit existe
            $product = Product::find($productId);
            if (!$product) {
                Log::error('Product not found', ['product_id' => $productId]);
                return response()->json(['error' => 'Product not found'], 404);
            }

            // Vérifier si le produit est déjà dans les favoris
            $existingItem = WishList::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($existingItem) {
                Log::info('Product already in wishlist', ['product_id' => $productId]);
                return response()->json(['message' => 'Product already in wishlist']);
            }

            // Créer un nouvel élément dans la wishlist
            $wishListItem = new WishList();
            $wishListItem->user_id = $user->id;
            $wishListItem->product_id = $productId;
            $wishListItem->save();

            Log::info('Product added to wishlist successfully', [
                'user_id' => $user->id,
                'product_id' => $productId
            ]);

            return response()->json($wishListItem, 201);
        } catch (\Exception $e) {
            Log::error('Error adding to wishlist', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'user' => Auth::user() ? Auth::user()->id : null
            ]);
            return response()->json(['error' => 'Failed to add to wishlist: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Supprime un produit de la liste de souhaits de l'utilisateur
     * 
     * @param int $id L'ID de l'élément de la liste de souhaits
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $wishListItem = WishList::where('user_id', $user->id)
                ->where('id', $id)
                ->firstOrFail();

            $wishListItem->delete();
            return response()->json(['message' => 'Product removed from wishlist']);
        } catch (\Exception $e) {
            Log::error('Error removing from wishlist: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to remove from wishlist'], 500);
        }
    }

    /**
     * Vide la liste de souhaits de l'utilisateur
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearWishList()
    {
        $user = Auth::user();
        WishList::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Liste de souhaits vidée']);
    }
}
