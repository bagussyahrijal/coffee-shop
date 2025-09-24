import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Item } from '@/types/item';

export default function Show() {
    const { item } = usePage().props as any;
    return (
        <AppLayout breadcrumbs={[{ title: 'Items', href: '/items' }, { title: item.name, href: `/items/${item.id}` }]}> 
            <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
            <div className="mb-4">
                <strong>Harga:</strong> Rp {item.price}
            </div>
            <div className="mb-4">
                <strong>Deskripsi:</strong> {item.description}
            </div>
            <div className="mb-4">
                <strong>Gambar:</strong><br />
                {item.image ? <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" /> : '-'}
            </div>
            <Link href="/items" className="btn btn-secondary">Kembali</Link>
        </AppLayout>
    );
}
