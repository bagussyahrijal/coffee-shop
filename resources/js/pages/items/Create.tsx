import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useRef } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        description: '',
        image: null as File | null,
    });
    const fileInput = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }
        post('/items', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInput.current) fileInput.current.value = '';
            },
        });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Items', href: '/items' }, { title: 'Tambah', href: '/items/create' }]}> 
            <h1 className="text-2xl font-bold mb-4">Tambah Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg" encType="multipart/form-data">
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
                    <label className="block">Gambar (Upload)</label>
                    <input type="file" className="input input-bordered w-full" accept="image/*" onChange={handleFileChange} ref={fileInput} />
                    {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={processing}>Simpan</button>
            </form>
        </AppLayout>
    );
}
