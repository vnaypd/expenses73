// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

// Expense types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
}

// Analytics types
export interface ExpenseSummary {
  totalAmount: number;
  expenseCount: number;
  averageAmount: number;
  categorySummary: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

// Filter types
export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}