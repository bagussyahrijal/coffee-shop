<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        // Selalu load fresh cart data
        $cartItems = Cart::with(['item.category'])
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($cart) {
                $cart->total = $cart->quantity * $cart->price;
                return $cart;
            });

        $cartTotal = $cartItems->sum('total');
        $cartCount = $cartItems->sum('quantity');

        // Redirect ke home jika cart kosong
        if ($cartItems->isEmpty()) {
            return redirect()->route('/dashboard')->with('error', 'Your cart is empty!');
        }

        return Inertia::render('checkout', [
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
            'cartCount' => $cartCount,
        ]);
    }
}
