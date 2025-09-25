<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled'
        ]);

        $order->update([
            'status' => $request->status,
            'confirmed_at' => $request->status === 'confirmed' ? now() : $order->confirmed_at,
            'completed_at' => $request->status === 'completed' ? now() : $order->completed_at,
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully!');
    }
}
