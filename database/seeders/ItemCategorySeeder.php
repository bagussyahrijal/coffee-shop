<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ItemCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Create default user first
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $categories =
         [
            [
                'name' => 'Coffee',
                'icon' => '☕',
                'is_available' => true,
            ],
            [
                'name' => 'Tea',
                'icon' => '🫖',
                'is_available' => true,
            ],
            [
                'name' => 'Snack',
                'icon' => '🍪',
                'is_available' => false,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}