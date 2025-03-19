<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'title' => $title,
            'category' => fake()->randomElement(['Vêtements', 'Chaussures', 'Accessoires', 'Bijoux', 'Montres']),
            // 'image' => fake()->imageUrl(640, 480, 'fashion'),
            // 'image' => 'images/products/1741968191.jpg',
            'slug' => Str::slug($title),
            'brand' => fake()->randomElement(['Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Apple', 'Samsung']),
            'color' => fake()->randomElement(['Rouge', 'Bleu', 'Noir', 'Blanc', 'Vert', 'Jaune', 'Rose']),
            'size' => fake()->randomElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'discount_percentage' => fake()->randomFloat(2, 0, 50),
            'discounted_price' => fake()->randomFloat(2, 10, 1000),
        ];
    }
}
