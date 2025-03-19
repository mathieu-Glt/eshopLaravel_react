<?php

use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\WishListController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });
    //Routes pour la liste de wishList
    Route::get('/wishlist', [WishListController::class, 'index']);
    Route::post('/wishlist', [WishListController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishListController::class, 'destroy']);
    Route::post('/comments', [CommentController::class, 'addComment']);



    // Routes pour les administrateurs
    Route::middleware('role:admin')->group(function () {
        // Routes des utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        // Routes des produits
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::post('/products/{product}/image', [ProductController::class, 'updateImage']);

        // Autres routes
        Route::get('/user/{id}/roles', [RoleController::class, 'getUserRoles']);

    });

});




// Routes pour les commentaires
Route::get('/comments/products/{productId}', [CommentController::class, 'getComments']);
Route::delete('/comments/{id}', [CommentController::class, 'removeComment']);

// Public routes for products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::post('/logout', [AuthController::class, 'logout']);


