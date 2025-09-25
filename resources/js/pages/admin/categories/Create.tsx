import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '',
        is_available: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/categories');
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }, { title: 'Create', href: '/categories/create' }]}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create Category</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.name && <div className="mt-1 text-red-600 text-sm">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Icon (emoji)</label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={e => setData('icon', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder="☕"
                        />
                        {errors.icon && <div className="mt-1 text-red-600 text-sm">{errors.icon}</div>}
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_available}
                                onChange={e => setData('is_available', e.target.checked)}
                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                            <span className="ml-2">Available</span>
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Create Category
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}