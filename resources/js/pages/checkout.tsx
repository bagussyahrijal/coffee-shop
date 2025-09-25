import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    icon: string;
}

interface Item {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category_id: number;
    category: Category;
}

interface CartItem {
    id: number;
    item_id: number;
    quantity: number;
    price: number;
    total: number;
    item: Item;
}

interface Props {
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
}

export default function Checkout({ cartItems, cartTotal, cartCount }: Props) {
    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '',
        customer_phone: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/orders', checkoutForm, {
            onSuccess: () => {
                // Redirect akan ditangani oleh controller
            },
            onError: () => {
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Redirect jika cart kosong
    if (cartItems.length === 0) {
        return (
            <AppLayout>
                <Head title="Checkout" />
                <div className="max-w-2xl mx-auto py-12 text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
                    <Link
                        href="/"
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Checkout" />

            <div className="max-w-4xl mx-auto py-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href="/"
                            className="text-amber-600 hover:text-amber-700 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Menu
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600">Complete your order information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold mb-6">Customer Information</h2>

                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div>
                                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="customer_name"
                                    value={checkoutForm.customer_name}
                                    onChange={(e) => setCheckoutForm({...checkoutForm, customer_name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="customer_phone"
                                    value={checkoutForm.customer_phone}
                                    onChange={(e) => setCheckoutForm({...checkoutForm, customer_phone: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    value={checkoutForm.notes}
                                    onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Any special requests, dietary restrictions, or delivery instructions..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-amber-600 text-white py-4 rounded-lg hover:bg-amber-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((cartItem) => (
                                <div key={cartItem.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    {cartItem.item.image && (
                                        <img
                                            src={`/storage/${cartItem.item.image}`}
                                            alt={cartItem.item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{cartItem.item.name}</h3>
                                        <p className="text-sm text-gray-600">{cartItem.item.category.name}</p>
                                        <p className="text-sm text-gray-500">
                                            ${cartItem.price} × {cartItem.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${cartItem.total}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                                <span className="font-semibold">${cartTotal}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Service Fee</span>
                                <span className="font-semibold">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t">
                                <span>Total</span>
                                <span className="text-amber-600">${cartTotal}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                            <h4 className="font-medium text-amber-800 mb-2">Order Information</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Your order will be prepared upon confirmation</li>
                                <li>• Estimated preparation time: 10-15 minutes</li>
                                <li>• You will receive updates via phone</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
