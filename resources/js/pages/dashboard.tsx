import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    icon: string;
    is_available: boolean;
    items: Item[];
}

interface Item {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category_id: number;
}

interface CartItem {
    id: number;
    item_id: number;
    quantity: number;
    price: number;
    total: number;
    item: Item;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    categories: Category[];
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
    auth: {
        user: User | null;
    };
}

export default function Dashboard({ categories, cartItems, cartTotal, cartCount, auth }: Props) {
    const [showCart, setShowCart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // State untuk cart data yang akan diupdate
    const [currentCartItems, setCurrentCartItems] = useState(cartItems);
    const [currentCartTotal, setCurrentCartTotal] = useState(cartTotal);
    const [currentCartCount, setCurrentCartCount] = useState(cartCount);

    // Update cart state when props change
    useEffect(() => {
        setCurrentCartItems(cartItems);
        setCurrentCartTotal(cartTotal);
        setCurrentCartCount(cartCount);
    }, [cartItems, cartTotal, cartCount]);

    // Check for flash messages
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash?.cartUpdated) {
            // Refresh cart data
            router.reload({ only: ['cartItems', 'cartTotal', 'cartCount'] });
        }
    }, [flash]);

    // Check if user is authenticated
    const isAuthenticated = auth.user !== null;

    // Function to handle authentication check
    const requireAuth = (callback: () => void) => {
        if (!isAuthenticated) {
            router.visit('/login', {
                onBefore: () => {
                    // Optional: Show a message why they need to login
                    alert('Please login to continue shopping');
                }
            });
            return;
        }
        callback();
    };

    const addToCart = (itemId: number, quantity: number = 1) => {
        requireAuth(() => {
            router.post('/cart', {
                item_id: itemId,
                quantity: quantity,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['cartItems', 'cartTotal', 'cartCount', 'flash'],
                onSuccess: () => {
                    // Cart will be updated via useEffect when props change
                }
            });
        });
    };

    const updateCartQuantity = (cartId: number, quantity: number) => {
        if (quantity < 1) return;

        requireAuth(() => {
            router.put(`/cart/${cartId}`, {
                quantity: quantity,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['cartItems', 'cartTotal', 'cartCount', 'flash'],
            });
        });
    };

    const removeFromCart = (cartId: number) => {
        requireAuth(() => {
            router.delete(`/cart/${cartId}`, {
                preserveState: true,
                preserveScroll: true,
                only: ['cartItems', 'cartTotal', 'cartCount', 'flash'],
            });
        });
    };

    const handleShowCart = () => {
        requireAuth(() => {
            setShowCart(true);
        });
    };

    const goToCheckout = () => {
        requireAuth(() => {
            if (currentCartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            router.visit('/checkout');
        });
    };

    const filteredCategories = selectedCategory
        ? categories.filter(cat => cat.id === selectedCategory)
        : categories.filter(cat => cat.is_available);

    return (
        <AppLayout>
            <Head title="Coffee Shop" />

            {/* Header */}
            <div className='p-8'>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome to Meow Cat Cafe </h1>
                            <p className="text-gray-600 mt-2">
                                {isAuthenticated
                                    ? 'Discover our premium coffee and delicious treats'
                                    : 'Please login to start shopping and manage your cart'
                                }
                            </p>
                        </div>
                        <button
                            onClick={handleShowCart}
                            className={`relative px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-colors ${
                                isAuthenticated
                                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                                    : 'bg-gray-400 text-white hover:bg-gray-500'
                            }`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span>{isAuthenticated ? 'Cart' : 'Login to Shop'}</span>
                            {isAuthenticated && currentCartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                                    {currentCartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                {/* Login Notice for Non-authenticated Users */}
                {!isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900">Ready to start shopping?</h3>
                                <p className="text-blue-700 text-sm">Login to add items to your cart and place orders</p>
                            </div>
                            <button
                                onClick={() => router.visit('/login')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                )}
                {/* Category Filter */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${
                            selectedCategory === null
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        All Items
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
                                selectedCategory === category.id
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
                {/* Categories and Items */}
                <div className="space-y-8">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <span className="text-3xl">{category.icon}</span>
                                    {category.name}
                                    <span className="text-sm font-normal text-gray-500">
                                        ({category.items.length} items)
                                    </span>
                                </h2>
                            </div>
                            {category.items.length > 0 ? (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                                            {item.image && (
                                                <div className="relative h-48 overflow-hidden rounded-t-lg">
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            4.5
                                                        </div>
                                                    </div>
                                                    {/* Overlay for non-authenticated users */}
                                                    {!isAuthenticated && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                            <div className="text-white text-center">
                                                                <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                                                                <p className="text-sm font-semibold">Login to Shop</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-amber-600">
                                                        ${item.price}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item.id)}
                                                        disabled={!isAuthenticated}
                                                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                                                            isAuthenticated
                                                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                                                : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                                                        }`}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    <div className="text-4xl mb-4">{category.icon}</div>
                                    <p>No items available in this category</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Cart Sidebar - Only show if authenticated */}
                {showCart && isAuthenticated && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
                        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold">Shopping Cart</h3>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-gray-600 mt-1">{currentCartCount} items</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    {currentCartItems.length > 0 ? (
                                        <div className="space-y-4">
                                            {currentCartItems.map((cartItem) => (
                                                <div key={cartItem.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    {cartItem.item.image && (
                                                        <img
                                                            src={`/storage/${cartItem.item.image}`}
                                                            alt={cartItem.item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{cartItem.item.name}</h4>
                                                        <p className="text-gray-600">${cartItem.price}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <button
                                                                onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                                                                disabled={cartItem.quantity <= 1}
                                                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="px-3 py-1 bg-gray-100 rounded">{cartItem.quantity}</span>
                                                            <button
                                                                onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                                                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(cartItem.id)}
                                                                className="ml-auto text-red-500 hover:text-red-700"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">${cartItem.total}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">Your cart is empty</p>
                                        </div>
                                    )}
                                </div>
                                {currentCartItems.length > 0 && (
                                    <div className="p-6 border-t bg-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold">Total:</span>
                                            <span className="text-2xl font-bold text-amber-600">${currentCartTotal}</span>
                                        </div>
                                        <button
                                            onClick={goToCheckout}
                                            className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            )}
            </div>
        </AppLayout>
    );
}
