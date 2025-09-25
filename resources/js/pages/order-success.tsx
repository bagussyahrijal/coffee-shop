import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, Phone, User } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    customer_info: {
        name: string;
        phone: string;
    };
    notes: string;
    order_items: OrderItem[];
    created_at: string;
}

interface OrderItem {
    id: number;
    item_name: string;
    quantity: number;
    price: number;
    total: number;
}

interface Props {
    order: Order;
}

export default function OrderSuccess({ order }: Props) {
    return (
        <AppLayout>
            <Head title="Order Confirmed" />

            <div className="max-w-2xl mx-auto py-12">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">Thank you for your order. We'll start preparing it right away.</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="font-bold text-lg">{order.order_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold text-lg text-green-600">${order.total_amount}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-semibold">{order.customer_info.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">{order.customer_info.phone}</p>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">Special Notes</p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-700">{order.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div>
                        <p className="text-sm text-gray-500 mb-3">Order Items</p>
                        <div className="space-y-2">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.item_name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                    </div>
                                    <p className="font-semibold">${item.total}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800">What's Next?</h3>
                    </div>
                    <ul className="text-sm text-amber-700 space-y-2">
                        <li>• Your order is being prepared</li>
                        <li>• Estimated preparation time: 10-15 minutes</li>
                        <li>• We'll call you when your order is ready for pickup</li>
                        <li>• Please keep your phone nearby</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
