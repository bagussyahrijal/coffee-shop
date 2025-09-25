<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $carts = Cart::with('item.category')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($cart) {
                $cart->total = $cart->quantity * $cart->price;
                return $cart;
            });

        return response()->json([
            'carts' => $carts,
            'total' => $carts->sum('total'),
            'count' => $carts->sum('quantity'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $item = Item::findOrFail($request->item_id);
        $quantity = $request->quantity ?? 1;

        $cart = Cart::where('user_id', Auth::id())
            ->where('item_id', $item->id)
            ->first();

        if ($cart) {
            $cart->update([
                'quantity' => $cart->quantity + $quantity,
                'price' => $item->price, // Update price in case it changed
            ]);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'item_id' => $item->id,
                'quantity' => $quantity,
                'price' => $item->price,
            ]);
        }

        // Return updated cart data
        return redirect()->back()->with([
            'success' => 'Item added to cart!',
            'cartUpdated' => true
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->update([
            'quantity' => $request->quantity,
        ]);

        return redirect()->back()->with([
            'success' => 'Cart updated!',
            'cartUpdated' => true
        ]);
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        return redirect()->back()->with([
            'success' => 'Item removed from cart!',
            'cartUpdated' => true
        ]);
    }

    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();

        return redirect()->back()->with([
            'success' => 'Cart cleared!',
            'cartUpdated' => true
        ]);
    }
}
