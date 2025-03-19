<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
/**
 * CommentController
 * 
 * Gère toutes les opérations liées aux commentaires des produits
 */
class CommentController extends Controller
{
    /**
     * Ajoute un commentaire à un produit
     * 
     * @param Request $request La requête contenant :
     *                         - product_id : ID du produit
     *                         - comment : Texte du commentaire
     *                         - rating : Note donnée (1-5)
     * @return \Illuminate\Http\JsonResponse
     */
    public function addComment(Request $request)
    {
        $user = Auth::user();
        Log::info($request->all());

        if (!$user) {
            return response()->json(['message' => 'Vous devez être connecté pour ajouter un commentaire'], 401);
        }

        if (!$request->product_id) {
            return response()->json(['message' => 'L\'ID du produit est requis'], 400);
        }

        if (!$request->comment) {
            return response()->json(['message' => 'Le commentaire est requis'], 400);
        }
        $product = Product::findOrFail($request->product_id);
        Log::info($product);
        if (!$product) {
            return response()->json(['message' => 'Le produit n\'existe pas'], 404);
        }

        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->product_id = $product->id;
        $comment->comment = $request->comment;
        $comment->rating = $request->rating;
        $comment->save();

        return response()->json(['message' => 'Commentaire ajouté avec succès']);
    }



    /**
     * Supprime un commentaire d'un produit
     * 
     * @param Request $request La requête contenant :
     *                         - product_id : ID du produit
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeComment(Request $request)
    {
        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);

        $comment = Comment::where('user_id', $user->id)->where('product_id', $product->id)->first();

        if ($comment) {
            $comment->delete();
        }

        return response()->json(['message' => 'Commentaire supprimé avec succès']);
    }

    /**
     * Récupère tous les commentaires d'un produit
     * 
     * @param Request $request La requête contenant :
     *                         - product_id : ID du produit
     * @return \Illuminate\Http\JsonResponse Liste des commentaires
     */
    public function getComments($productId)
    {
        try {
            $comments = Comment::where('product_id', $productId)->get();
            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Supprime tous les commentaires d'un produit
     * 
     * @param Request $request La requête contenant :
     *                         - product_id : ID du produit
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearComments(Request $request)
    {
        $product = Product::findOrFail($request->product_id);
        Comment::where('product_id', $product->id)->delete();
        return response()->json(['message' => 'Commentaires supprimés avec succès']);
    }
}
