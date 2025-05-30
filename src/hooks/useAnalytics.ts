import { useMemo } from 'react';
import { Expense, ExpenseSummary, CategorySummary } from '../types';

export const useAnalytics = (expenses: Expense[]) => {
  const summary = useMemo<ExpenseSummary>(() => {
    if (!expenses.length) {
      return {
        totalAmount: 0,
        expenseCount: 0,
        averageAmount: 0,
        categorySummary: [],
      };
    }

    // Calculate total amount and expense count
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;
    const averageAmount = totalAmount / expenseCount;

    // Group expenses by category and calculate amount per category
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });

    // Convert to category summary array
    const categorySummary: CategorySummary[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalAmount) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalAmount,
      expenseCount,
      averageAmount,
      categorySummary,
    };
  }, [expenses]);

  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      
      monthlyData[monthYear] += expense.amount;
    });
    
    // Sort by month-year and convert to array
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month,
        amount,
      }));
  }, [expenses]);

  // Get current month expenses
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses]);

  // Calculate current month total
  const currentMonthTotal = useMemo(() => {
    return currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [currentMonthExpenses]);

  return {
    summary,
    monthlyTrends,
    currentMonthExpenses,
    currentMonthTotal,
  };
};