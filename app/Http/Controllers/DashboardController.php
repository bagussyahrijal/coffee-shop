<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $categories = Category::with(['items' => function ($query) {
            $query->latest();
        }])
        ->where('is_available', true)
        ->orderBy('name')
        ->get();

        // Selalu load cart data jika user login
        $cartItems = collect();
        $cartTotal = 0;
        $cartCount = 0;

        if (Auth::check()) {
            $cartItems = Cart::with(['item.category'])
                ->where('user_id', Auth::id())
                ->get()
                ->map(function ($cart) {
                    $cart->total = $cart->quantity * $cart->price;
                    return $cart;
                });

            $cartTotal = $cartItems->sum('total');
            $cartCount = $cartItems->sum('quantity');
        }

        return Inertia::render('dashboard', [
            'categories' => $categories,
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
            'cartCount' => $cartCount,
        ]);
    }
}
