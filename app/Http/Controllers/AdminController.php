<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use App\Models\Order;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('items')
            ->orderBy('created_at', 'desc')
            ->get();

        $items = Item::with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        $orders = Order::with(['user', 'orderItems.item'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $todayOrders = Order::whereDate('created_at', today())->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalRevenue = Order::where('status', 'completed')
            ->sum('total_amount');

        return Inertia::render('admin/dashboard', [
            'categories' => $categories,
            'items' => $items,
            'orders' => $orders,
            'stats' => [
                'todayOrders' => $todayOrders,
                'pendingOrders' => $pendingOrders,
                'totalRevenue' => $totalRevenue,
            ]
        ]);
    }
}
