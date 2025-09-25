<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        $cartItems = Cart::with('item')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('home')->with('error', 'Your cart is empty!');
        }

        $order = DB::transaction(function () use ($request, $cartItems) {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $cartItems->sum(fn($cart) => $cart->quantity * $cart->price),
                'customer_info' => [
                    'name' => $request->customer_name,
                    'phone' => $request->customer_phone,
                ],
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $cartItem->item_id,
                    'item_name' => $cartItem->item->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'total' => $cartItem->quantity * $cartItem->price,
                ]);
            }

            // Clear cart
            Cart::where('user_id', Auth::id())->delete();

            return $order;
        });

        return redirect()->route('order.success', $order->order_number)
            ->with('success', 'Order placed successfully!');
    }

    public function success($orderNumber)
    {
        $order = Order::with(['orderItems.item', 'user'])
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return inertia('order-success', [
            'order' => $order
        ]);
    }
}
