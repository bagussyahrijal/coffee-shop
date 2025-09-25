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
