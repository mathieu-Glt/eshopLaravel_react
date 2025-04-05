<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private function getNextImageNumber(): int
    {
        // Récupérer tous les fichiers du dossier images
        $files = Storage::disk('public')->files('images');

        $maxNumber = 0;

        foreach ($files as $file) {
            // Extraire le numéro du nom du fichier (ex: "1.jpeg" -> 1)
            if (preg_match('/(\d+)\.jpeg$/', $file, $matches)) {
                $number = (int) $matches[1];
                $maxNumber = max($maxNumber, $number);
            }
        }

        // Retourner le prochain numéro
        return $maxNumber + 1;
    }

    public function index()
    {
        try {
            $products = Product::all();
            Log::info('Products fetched successfully', ['products' => $products->toArray()]);
            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch products'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'slug' => 'nullable|string|max:255',
                'brand' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'size' => 'nullable|string|max:255',
                'discount_percentage' => 'nullable|numeric|min:0|max:100',
                'discounted_price' => 'nullable|numeric|min:0',
            ]);

            // Gérer l'upload de l'image
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/images', $filename);
                $validated['image'] = 'images/' . $filename;
            }
            $product = new Product();
            $product->title = $request->title;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->stock = $request->stock;
            $product->discount_percentage = $request->discount_percentage;

            // Calculer le prix réduit si une promotion est définie
            if ($request->discount_percentage) {
                $product->discounted_price = $request->price * (1 - ($request->discount_percentage / 100));
            } else {
                $product->discounted_price = null;
            }

            // Gérer l'upload de l'image
            if ($request->hasFile('image')) {
                $image = $request->file('image');

                // Obtenir le prochain numéro pour l'image
                $nextNumber = $this->getNextImageNumber();
                $filename = $nextNumber . '.jpeg';

                // Stocker l'image dans storage/app/public/images
                $path = $image->storeAs('images', $filename, 'public');

                // Mettre à jour le chemin de l'image
                $product->image = 'storage/' . $path;

                Log::info('Image uploadée:', [
                    'path' => $product->image,
                    'number' => $nextNumber
                ]);
            }

            $product->save();

            return response()->json([
                'message' => 'Produit créé avec succès',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create product'], 500);
        }
    }

    public function show($id)
    {
        try {
            Log::info('Attempting to fetch product', ['id' => $id]);

            $product = Product::where('id', $id)->first();

            if (!$product) {
                Log::warning('Product not found', ['id' => $id]);
                return response()->json(['error' => 'Product not found'], 404);
            }

            Log::info('Product found successfully', ['product' => $product->toArray()]);
            return response()->json($product);

        } catch (\Exception $e) {
            Log::error('Error fetching product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch product: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Début de la mise à jour du produit', [
                'product_id' => $id,
                'request_data' => $request->all(),
                'headers' => $request->headers->all()
            ]);

            // Trouver le produit par ID
            $product = Product::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category' => 'nullable|string|max:255',
                'image' => 'nullable|string',
                'slug' => 'nullable|string|max:255',
                'brand' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'size' => 'nullable|string|max:255'
            ]);

            Log::info('Données validées:', ['validated' => $validated]);

            // Sauvegarde des anciennes valeurs pour comparaison
            $oldValues = $product->toArray();

            // Mise à jour du produit
            foreach ($validated as $key => $value) {
                $product->$key = $value;
            }

            $saved = $product->save();

            Log::info('Résultat de la sauvegarde:', [
                'saved' => $saved,
                'old_values' => $oldValues,
                'new_values' => $product->toArray()
            ]);

            if (!$saved) {
                throw new \Exception('La sauvegarde a échoué');
            }

            return response()->json([
                'message' => 'Produit mis à jour avec succès',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du produit', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Erreur lors de la mise à jour du produit: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('Tentative de suppression du produit', ['product_id' => $id]);

            $product = Product::findOrFail($id);

            // Si le produit a une image, on la supprime aussi
            if ($product->image) {
                $imagePath = str_replace('storage/', '', $product->image);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                    Log::info('Image du produit supprimée', ['path' => $imagePath]);
                }
            }

            $product->delete();

            Log::info('Produit supprimé avec succès', ['product_id' => $id]);
            return response()->json(['message' => 'Produit supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du produit', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Erreur lors de la suppression du produit: ' . $e->getMessage()], 500);
        }
    }

    public function updateImage(Request $request, Product $product)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');

                // Obtenir le prochain numéro pour l'image
                $nextNumber = $this->getNextImageNumber();
                $filename = $nextNumber . '.jpeg';

                // Stocker l'image dans storage/app/public/images
                $path = $image->storeAs('images', $filename, 'public');

                // Mettre à jour le chemin de l'image dans la base de données
                $product->image = 'storage/' . $path;
                $product->save();

                Log::info('Image mise à jour:', [
                    'product_id' => $product->id,
                    'path' => $product->image,
                    'number' => $nextNumber
                ]);

                return response()->json([
                    'message' => 'Image mise à jour avec succès',
                    'image' => $product->image
                ]);
            }

            return response()->json(['error' => 'Aucune image fournie'], 400);
        } catch (\Exception $e) {
            Log::error('Error updating product image: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update product image'], 500);
        }
    }

    public function getProductsStock()
    {
        try {
            $products = Product::select('id', 'title', 'stock', 'image')
                ->get()

                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'title' => $product->title,
                        'stock' => $product->stock,
                        'image' => $product->image ? Storage::url($product->image) : null,
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getLowStockProducts()
    {
        try {
            $products = Product::select('id', 'title', 'stock', 'image')
                ->where('stock', '<', 20)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'title' => $product->title,
                        'stock' => $product->stock,
                        'image' => $product->image ? Storage::url($product->image) : null,
                    ];
                });
            Log::info('Produits en stock faible récupérés', ['products' => $products]);
            return response()->json([
                'status' => 'success',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des produits en stock faible',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}