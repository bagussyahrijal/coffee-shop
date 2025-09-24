import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Item } from '@/types/item';
import { useState } from 'react';

export default function Index() {
    const { items, flash } = usePage().props as any;
    const [cart, setCart] = useState<{ [id: number]: number }>({});

    const handleAddToCart = (item: Item) => {
        setCart((prev: any) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Items', href: '/items' }]}> 
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Order</h1>
                <Link href="/items/create" className="btn btn-primary">Tambah Item</Link>
            </div>
            {flash?.success && <div className="alert alert-success mb-4">{flash.success}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.data.map((item: Item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col relative group transition hover:shadow-lg">
                        <div className="relative">
                            <img
                                src={item.image ? `/storage/${item.image}` : 'https://placehold.co/400x300?text=No+Image'}
                                alt={item.name}
                                className="rounded-t-xl w-full h-40 object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full shadow">
                                Available
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col p-4 gap-2">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="font-semibold text-lg truncate" title={item.name}>{item.name}</h2>
                                <span className="text-primary font-bold text-base">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <p className="text-gray-500 text-sm flex-1 line-clamp-2">{item.description || '-'}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="btn btn-sm btn-primary flex-1"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    {cart[item.id] ? `Add More ( ${cart[item.id]} )` : '+ Add to Cart'}
                                </button>
                                <Link href={`/items/${item.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Link href={`/items/${item.id}`} className="btn btn-sm btn-info flex-1">Lihat</Link>
                                <Link as="button" method="delete" href={`/items/${item.id}`} className="btn btn-sm btn-danger flex-1" preserveScroll>Hapus</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
