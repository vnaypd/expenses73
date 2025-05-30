import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { useCategoryStore } from '../store/categoryStore';
import ExpenseStats from '../components/dashboard/ExpenseStats';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses, loading: expensesLoading } = useExpenseStore();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();

  useEffect(() => {
    if (user) {
      fetchExpenses(user.id);
      fetchCategories(user.id);
    }
  }, [user, fetchExpenses, fetchCategories]);

  const loading = expensesLoading || categoriesLoading;

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-subtle p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-subtle p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="space-y-8">
        {/* Stats cards */}
        <ExpenseStats expenses={expenses} />
        
        {/* Charts */}
        <ExpenseChart expenses={expenses} categories={categories} />
        
        {/* Recent expenses */}
        <RecentExpenses expenses={expenses} categories={categories} />
      </div>
    </div>
  );
};

export default DashboardPage;