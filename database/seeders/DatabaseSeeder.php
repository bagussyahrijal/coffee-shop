<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Starting DatabaseSeeder...');

        try {
            // Cek apakah user sudah ada
            if (User::where('email', 'admin@gmail.com')->exists()) {
                $this->command->info('Admin user already exists!');
            } else {
                User::create([
                    'name' => 'Admin',
                    'email' => 'admin@gmail.com',
                    'role' => 'admin',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]);
                $this->command->info('Admin user created successfully!');
            }

            // Cek jumlah users
            $userCount = User::count();
            $this->command->info("Total users in database: {$userCount}");
        } catch (\Exception $e) {
            $this->command->error('Error creating admin user: ' . $e->getMessage());
        }

        // Comment ItemCategorySeeder untuk sementara
        // $this->call([
        //     ItemCategorySeeder::class,
        // ]);
    }
}
