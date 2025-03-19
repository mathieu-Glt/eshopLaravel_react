<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            RoleSeeder::class,
            ProductSeeder::class,
        ]);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password')
        ]);
        $admin->assignRole('admin');

        $user = User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password')
        ]);
        $user->assignRole('user');

        // Création des produits avec les images existantes
        Product::create([
            'title' => 'T-shirt Basic',
            'description' => 'Un t-shirt basique en coton',
            'price' => 29.99,
            'stock' => 100,
            'image' => 'images/1.jpeg',
            'discount_percentage' => 20,
            'discounted_price' => 23.99
        ]);

        Product::create([
            'title' => 'Jean Slim',
            'description' => 'Un jean slim fit',
            'price' => 79.99,
            'stock' => 50,
            'image' => 'images/2.jpeg',
            'discount_percentage' => null,
            'discounted_price' => null
        ]);

        Product::create([
            'title' => 'Sneakers Sport',
            'description' => 'Des sneakers confortables',
            'price' => 89.99,
            'stock' => 30,
            'image' => 'images/3.jpeg',
            'discount_percentage' => 15,
            'discounted_price' => 76.49
        ]);

        // Créer 20 produits avec la factory
        // Product::factory(20)->create();
    }
}
