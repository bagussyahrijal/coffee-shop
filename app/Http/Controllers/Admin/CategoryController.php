<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'icon' => 'nullable|string|max:10',
            'is_available' => 'boolean',
        ]);

        Category::create([
            'name' => $request->name,
            'icon' => $request->icon ?? '📦',
            'is_available' => $request->is_available ?? true,
        ]);

        return redirect()->back()->with('success', 'Category created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'icon' => 'nullable|string|max:10',
            'is_available' => 'boolean',
        ]);

        $category->update([
            'name' => $request->name,
            'icon' => $request->icon ?? $category->icon,
            'is_available' => $request->is_available ?? $category->is_available,
        ]);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if category has items
        if ($category->items()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete category with existing items!');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully!');
    }
}
