import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Item } from '@/types/item';

export default function Edit() {
    const { item } = usePage().props as any;
    const { data, setData, put, processing, errors } = useForm({
        name: item.name || '',
        price: item.price || '',
        description: item.description || '',
        image: item.image || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/items/${item.id}`);
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Items', href: '/items' }, { title: 'Edit', href: `/items/${item.id}/edit` }]}> 
            <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block">Nama</label>
                    <input type="text" className="input input-bordered w-full" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>
                <div>
                    <label className="block">Harga</label>
                    <input type="number" className="input input-bordered w-full" value={data.price} onChange={e => setData('price', e.target.value)} />
                    {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                </div>
                <div>
                    <label className="block">Deskripsi</label>
                    <textarea className="input input-bordered w-full" value={data.description} onChange={e => setData('description', e.target.value)} />
                    {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                </div>
                <div>
                    <label className="block">Gambar (URL)</label>
                    <input type="text" className="input input-bordered w-full" value={data.image} onChange={e => setData('image', e.target.value)} />
                    {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={processing}>Update</button>
            </form>
        </AppLayout>
    );
}
