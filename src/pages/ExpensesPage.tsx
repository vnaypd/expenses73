import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { useCategoryStore } from '../store/categoryStore';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { Expense } from '../types';
import { PlusCircle, Filter, X } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    expenses, 
    fetchExpenses, 
    addExpense, 
    updateExpense, 
    deleteExpense,
    loading: expensesLoading,
    setFilters,
    resetFilters,
    filters
  } = useExpenseStore();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    if (user) {
      fetchExpenses(user.id);
      fetchCategories(user.id);
    }
  }, [user, fetchExpenses, fetchCategories]);
  
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };
  
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };
  
  const handleSubmit = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      
      setShowForm(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const applyFilters = () => {
    const filterOptions: any = {};
    
    if (startDate) {
      filterOptions.startDate = new Date(startDate);
    }
    
    if (endDate) {
      filterOptions.endDate = new Date(endDate);
    }
    
    if (selectedCategories.length > 0) {
      filterOptions.categories = selectedCategories;
    }
    
    if (minAmount) {
      filterOptions.minAmount = parseFloat(minAmount);
    }
    
    if (maxAmount) {
      filterOptions.maxAmount = parseFloat(maxAmount);
    }
    
    if (searchQuery) {
      filterOptions.searchQuery = searchQuery;
    }
    
    setFilters(filterOptions);
    
    if (user) {
      fetchExpenses(user.id);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setSearchQuery('');
    resetFilters();
    
    if (user) {
      fetchExpenses(user.id);
    }
  };
  
  const loading = expensesLoading || categoriesLoading;
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Expenses</h1>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <button
            type="button"
            onClick={handleAddExpense}
            className="btn-primary flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="searchQuery" className="form-label">Search</label>
              <input
                type="text"
                id="searchQuery"
                className="input"
                placeholder="Search descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="minAmount" className="form-label">Min Amount</label>
              <input
                type="number"
                id="minAmount"
                className="input"
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="maxAmount" className="form-label">Max Amount</label>
              <input
                type="number"
                id="maxAmount"
                className="input"
                placeholder="0.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={selectedCategories.includes(category.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.name]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 mr-4 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              onClick={applyFilters}
              className="btn-primary"
            >
              Apply Filters
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Expense form */}
      {showForm && (
        <div className="card mb-6 animate-fade-in">
          <h2 className="text-lg font-medium mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <ExpenseForm
            onSubmit={handleSubmit}
            initialData={editingExpense || undefined}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      
      {/* Expense list */}
      <ExpenseList
        expenses={expenses}
        categories={categories}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        isLoading={loading}
      />
    </div>
  );
};

export default ExpensesPage;