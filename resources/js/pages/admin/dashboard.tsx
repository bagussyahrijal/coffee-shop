import AdminLayout from "@/layouts/admin-layout";
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Package, Tag, Eye, EyeOff, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Category {
    id: number;
    name: string;
    icon: string;
    is_available: boolean;
    items_count: number;
    created_at: string;
}

interface Item {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category_id: number;
    category: Category;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    user: { name: string; email: string };
    total_amount: number;
    status: string;
    status_color: string;
    customer_info: { name: string; phone: string };
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
    categories: Category[];
    items: Item[];
    orders: {
        data: Order[];
        links: any;
        meta: any;
    };
    stats: {
        todayOrders: number;
        pendingOrders: number;
        totalRevenue: number;
    };
}

export default function Dashboard({ categories, items, orders, stats }: Props) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        icon: '',
        is_available: true
    });

    const [itemForm, setItemForm] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        image: null as File | null
    });

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCategory ? `/admin/categories/${editingCategory.id}` : '/admin/categories';
        const method = editingCategory ? 'put' : 'post';

        router[method](url, categoryForm, {
            onSuccess: () => {
                setShowCategoryModal(false);
                resetCategoryForm();
            }
        });
    };

    const handleItemSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', itemForm.name);
        formData.append('price', itemForm.price);
        formData.append('description', itemForm.description);
        formData.append('category_id', itemForm.category_id);
        if (itemForm.image) {
            formData.append('image', itemForm.image);
        }

        const url = editingItem ? `/admin/items/${editingItem.id}` : '/admin/items';
        const method = editingItem ? 'put' : 'post';

        router[method](url, formData, {
            forceFormData: true,
            onSuccess: () => {
                setShowItemModal(false);
                resetItemForm();
            }
        });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const deleteItem = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(`/admin/items/${id}`);
        }
    };

    const resetCategoryForm = () => {
        setCategoryForm({ name: '', icon: '', is_available: true });
        setEditingCategory(null);
    };

    const resetItemForm = () => {
        setItemForm({ name: '', price: '', description: '', category_id: '', image: null });
        setEditingItem(null);
    };

    const editCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            icon: category.icon,
            is_available: category.is_available
        });
        setShowCategoryModal(true);
    };

    const editItem = (item: Item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            price: item.price.toString(),
            description: item.description,
            category_id: item.category_id.toString(),
            image: null
        });
        setShowItemModal(true);
    };

    const updateOrderStatus = (orderId: number, status: string) => {
        router.put(`/admin/orders/${orderId}/status`, { status }, {
            onSuccess: () => {
                setShowOrderModal(false);
            }
        });
    };

    const viewOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    // Kategori emoji berdasarkan jenis
    const emojiCategories = {
        beverages: ['☕', '🍵', '🥤', '🧋', '🥛'],
        food: ['🍪', '🥐', '🧁', '🍰', '🥪', '🍔', '🥯'],
        desserts: ['🎂', '🍰', '🧁', '🍪', '🍩', '🥧'],
        fruits: ['🍎', '🍌', '🍊', '🍓', '🥝', '🍇'],
        special: ['⭐', '💎', '🔥', '✨', '💯', '🎁']
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            {/* Header */}
            <div className="px-8">
                <div className="mb-8 pt-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Manage your coffee shop items, categories, and orders</p>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 mr-4">
                                <Tag className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                                <p className="text-gray-600">Categories</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 mr-4">
                                <Package className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                                <p className="text-gray-600">Items</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 mr-4">
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                                <p className="text-gray-600">Pending Orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 mr-4">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                                <p className="text-gray-600">Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'orders'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'categories'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Categories
                            </button>
                            <button
                                onClick={() => setActiveTab('items')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'items'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Items
                            </button>
                        </nav>
                    </div>
                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Recent Orders</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{order.order_number}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{order.customer_info.name}</div>
                                                    <div className="text-sm text-gray-500">{order.customer_info.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">${order.total_amount}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status_color}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => viewOrder(order)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* Categories Tab */}
                    {activeTab === 'categories' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Categories</h2>
                                <button
                                    onClick={() => setShowCategoryModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Category
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <div key={category.id} className="border rounded-lg p-4 hover:shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{category.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold">{category.name}</h3>
                                                    <p className="text-sm text-gray-500">{category.items_count} items</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {category.is_available ? (
                                                    <Eye className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => editCategory(category)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Items Tab */}
                    {activeTab === 'items' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Items</h2>
                                <button
                                    onClick={() => setShowItemModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((item) => (
                                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md">
                                        {item.image && (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.name}
                                                className="w-full h-32 object-cover rounded-md mb-3"
                                            />
                                        )}
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                        <p className="text-lg font-bold text-green-600">${item.price}</p>
                                        <p className="text-xs text-gray-500 mb-3">{item.category.name}</p>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => editItem(item)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Category Modal - Dropdown version */}
                {showCategoryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h3>
                            <form onSubmit={handleCategorySubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={categoryForm.icon}
                                            onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                                            className="flex-1 border rounded-lg px-3 py-2"
                                        >
                                            <option value="">Select an emoji</option>
                                            <optgroup label="Beverages">
                                                {emojiCategories.beverages.map(emoji => (
                                                    <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Food">
                                                {emojiCategories.food.map(emoji => (
                                                    <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Desserts">
                                                {emojiCategories.desserts.map(emoji => (
                                                    <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Fruits">
                                                {emojiCategories.fruits.map(emoji => (
                                                    <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Special">
                                                {emojiCategories.special.map(emoji => (
                                                    <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                        <div className="w-12 h-10 border rounded-lg flex items-center justify-center text-xl bg-gray-50">
                                            {categoryForm.icon || '📦'}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Or type your own emoji in the input below:
                                    </div>
                                    <input
                                        type="text"
                                        value={categoryForm.icon}
                                        onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 mt-2 text-center text-xl"
                                        placeholder="Or type emoji directly"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={categoryForm.is_available}
                                            onChange={(e) => setCategoryForm({...categoryForm, is_available: e.target.checked})}
                                            className="mr-2"
                                        />
                                        Available
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCategoryModal(false);
                                            resetCategoryForm();
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        {editingCategory ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Item Modal */}
                {showItemModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingItem ? 'Edit Item' : 'Add Item'}
                            </h3>
                            <form onSubmit={handleItemSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={itemForm.price}
                                        onChange={(e) => setItemForm({...itemForm, price: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={itemForm.category_id}
                                        onChange={(e) => setItemForm({...itemForm, category_id: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={itemForm.description}
                                        onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        rows={3}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setItemForm({...itemForm, image: e.target.files?.[0] || null})}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowItemModal(false);
                                            resetItemForm();
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        {editingItem ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Order Detail Modal */}
                {showOrderModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Order Details</h3>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="font-semibold">{selectedOrder.order_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-semibold">{selectedOrder.customer_info.name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customer_info.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedOrder.status_color}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-semibold text-lg">${selectedOrder.total_amount}</p>
                                </div>
                            </div>
                            {selectedOrder.notes && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                                </div>
                            )}
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-3">Order Items</p>
                                <div className="space-y-2">
                                    {selectedOrder.order_items.map((item) => (
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
                            <div className="flex gap-2">
                                <select
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                    value={selectedOrder.status}
                                    className="flex-1 border rounded-lg px-3 py-2"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="ready">Ready</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
