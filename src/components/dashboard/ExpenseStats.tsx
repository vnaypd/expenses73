import React from 'react';
import { Expense } from '../../types';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ExpenseStatsProps {
  expenses: Expense[];
}

const ExpenseStats: React.FC<ExpenseStatsProps> = ({ expenses }) => {
  const { summary, currentMonthTotal } = useAnalytics(expenses);
  
  // Get previous month total
  const getPreviousMonthTotal = (): number => {
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    
    const previousMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === previousMonth.getMonth() &&
        expenseDate.getFullYear() === previousMonth.getFullYear()
      );
    });
    
    return previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  const previousMonthTotal = getPreviousMonthTotal();
  
  // Calculate month-over-month change
  const calculateChange = (): { percentage: number; increased: boolean } => {
    if (previousMonthTotal === 0) return { percentage: 0, increased: false };
    
    const change = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    return {
      percentage: Math.abs(change),
      increased: change > 0,
    };
  };
  
  const change = calculateChange();
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Expenses
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary.totalAmount)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{summary.expenseCount} total expenses</span>
            {' '}
            <span className="text-gray-500">with an average of {formatCurrency(summary.averageAmount)}</span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
              <ArrowDownCircle className="h-6 w-6 text-secondary-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Current Month
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(currentMonthTotal)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            {change.percentage > 0 ? (
              <span className={change.increased ? 'text-error-600' : 'text-success-600'}>
                {change.increased ? '↑' : '↓'} {change.percentage.toFixed(1)}%
              </span>
            ) : (
              <span className="text-gray-500">No change</span>
            )}
            {' '}
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden sm:col-span-2 lg:col-span-1">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent-100 rounded-md p-3">
              <ArrowUpCircle className="h-6 w-6 text-accent-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Top Category
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {summary.categorySummary.length > 0 ? summary.categorySummary[0].category : 'N/A'}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            {summary.categorySummary.length > 0 ? (
              <>
                <span className="font-medium text-gray-900">
                  {formatCurrency(summary.categorySummary[0].amount)}
                </span>
                {' '}
                <span className="text-gray-500">
                  ({summary.categorySummary[0].percentage.toFixed(1)}% of total)
                </span>
              </>
            ) : (
              <span className="text-gray-500">No categories found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStats;