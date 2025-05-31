import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/categoryStore';
import { Category } from '../types';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { getRandomColor } from '../utils/formatters';

const CategoriesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { categories, loading, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategoryStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(getRandomColor());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCategories(user.id);
    }
  }, [user, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name, color });
      } else {
        await addCategory({
          userId: user.id,
          name,
          color,
        });
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setName('');
      setColor(getRandomColor());
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setName('');
            setColor(getRandomColor());
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-error-50 text-error-700 p-4 rounded-lg flex items-center">
          <X className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="card animate-fade-in">
          <h2 className="text-lg font-medium mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Category Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g., Groceries"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color" className="form-label">Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setColor(getRandomColor())}
                  className="btn-outline text-sm"
                >
                  Random Color
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary flex-1">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card hover:shadow-elevated transition-shadow"
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 text-gray-500 hover:text-error-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;