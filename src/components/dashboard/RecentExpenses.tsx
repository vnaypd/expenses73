import React from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentExpensesProps {
  expenses: Expense[];
  categories: Category[];
  limit?: number;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ 
  expenses, 
  categories,
  limit = 5 
}) => {
  // Get recent expenses
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  
  // Get category color by name
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280'; // Default gray
  };
  
  if (recentExpenses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent expenses</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
        <Link
          to="/expenses"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentExpenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${getCategoryColor(expense.category)}20`,
                  color: getCategoryColor(expense.category),
                }}
              >
                {expense.category.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {truncateText(expense.description, 25)}
                </h4>
                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(expense.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;