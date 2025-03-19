<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'stock',
        'category',
        'image',
        'slug',
        'brand',
        'color',
        'size',
        'discount_percentage',
        'discounted_price'
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getImageAttribute($value)
    {
        if (empty($value)) {
            \Log::info('Empty image value');
            return null;
        }

        // Si c'est déjà une URL complète
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Nettoyer le chemin de l'image
        $value = str_replace('\\', '/', $value);

        // Extraire le nom de base et l'extension
        $pathInfo = pathinfo($value);
        $baseName = $pathInfo['filename'];

        // Vérifier les différentes extensions possibles
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];
        foreach ($extensions as $ext) {
            $filePath = storage_path("app/public/images/{$baseName}.{$ext}");
            if (file_exists($filePath)) {
                \Log::info("Image trouvée: {$filePath}");
                return url("storage/images/{$baseName}.{$ext}");
            }
        }

        \Log::warning("Aucune image trouvée pour: {$value}");
        return null;
    }

    public function setImageAttribute($value)
    {
        if (empty($value)) {
            $this->attributes['image'] = null;
            return;
        }

        if (is_string($value)) {
            if (filter_var($value, FILTER_VALIDATE_URL)) {
                $this->attributes['image'] = $value;
            } else {
                // Si c'est un chemin relatif existant, le garder tel quel
                $this->attributes['image'] = $value;
            }
        } else if (is_object($value) && method_exists($value, 'store')) {
            // Si c'est un fichier uploadé
            try {
                $path = $value->store('products', 'public');
                if (!$path) {
                    throw new \Exception('Failed to store image');
                }
                $this->attributes['image'] = $path;
            } catch (\Exception $e) {
                \Log::error('Error storing product image: ' . $e->getMessage());
                $this->attributes['image'] = null;
            }
        }
    }

    public function getPriceAttribute($value)
    {
        return (float) $value;
    }

    public function getStockAttribute($value)
    {
        return (int) $value;
    }
}
