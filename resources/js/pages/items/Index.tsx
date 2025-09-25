import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Item } from '@/types/item';
import { useState } from 'react';
// import { SearchIcon } from '@heroicons/react/outline';

interface Category {
    name: string;
    count: number;
    icon: string;
    available: boolean;
}

interface PageProps {
    items: {
        data: Item[];
        meta: any;
    };
    categories: Category[];
    [key: string]: unknown;
}

export default function Index() {
    const { items, categories } = usePage<PageProps>().props;

    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.data.filter((item: any) =>
        activeCategory ? item.category?.name === activeCategory : true
    );
  

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 py-6">
               

                {/* Search Bar */}
                <div className="relative mb-8">
                    <input
                        type="search"
                        placeholder="Search"
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                </div>

                {/* Categories */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`relative p-6 rounded-2xl transition-all ${
                                activeCategory === category.name
                                    ? 'bg-green-800 text-white'
                                    : 'bg-white hover:bg-green-50'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{category.icon}</span>
                                <div className="text-left">
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <p className="text-sm opacity-80">{category.count} Items</p>
                                </div>
                            </div>
                            {!category.available && (
                                <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                                    Need to re-stock
                                </span>
                            )}
                        </button>
                    ))} : {categories.length === 0 && (
                        <button className="relative p-6 rounded-2xl transition-all bg-white hover:bg-green-50">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">☕</span>
                                <div className="text-left">
                                    <h3 className="font-semibold">Coffee</h3>
                                    <p className="text-sm opacity-80">20 Items</p>
                                </div>
                            </div>
                            <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                                Available
                            </span>
                        </button>
                    )}  
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.data.map((item: Item) => (
                        <div key={item.id} className="bg-white rounded-xl p-4 relative group">
                            <img
                                src={item.image ? `/storage/${item.image}` : 'https://placehold.co/400x300?text=No+Image'}
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <span className="absolute top-6 right-6 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-green-800">
                                Available
                            </span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-green-800 font-bold mt-1">
                                        ${item.price}
                                    </p>
                                </div>
                                <button className="h-8 w-8 flex items-center justify-center bg-green-800 text-white rounded-full hover:bg-green-700 transition-colors">
                                    +
                                </button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
