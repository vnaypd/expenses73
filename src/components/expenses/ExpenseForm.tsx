import React, { useState, useEffect } from 'react';
import { Category, Expense } from '../../types';
import { useCategoryStore } from '../../store/categoryStore';
import { useAuthStore } from '../../store/authStore';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Expense>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  isSubmitting
}) => {
  const { user } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [date, setDate] = useState('');
  
  // Format date for the input
  useEffect(() => {
    if (initialData?.date) {
      const dateObj = new Date(initialData.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    } else {
      // Set today's date as default
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [initialData]);
  
  // Fetch categories on mount
  useEffect(() => {
    if (user) {
      fetchCategories(user.id);
    }
  }, [fetchCategories, user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
    };
    
    onSubmit(expenseData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="amount" className="form-label">Amount</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            className="input pl-7"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          className="input"
          placeholder="Lunch with colleagues"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          name="category"
          className="input"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="date" className="form-label">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          className="input"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Expense' : 'Add Expense'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;