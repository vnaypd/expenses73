import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Expense, ExpenseFilters } from '../types';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  filters: ExpenseFilters;
  
  fetchExpenses: (userId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilters: (filters: ExpenseFilters) => void;
  resetFilters: () => void;
}

const convertFirestoreExpense = (id: string, data: any): Expense => ({
  id,
  userId: data.userId,
  amount: data.amount,
  description: data.description,
  category: data.category,
  date: data.date.toDate(),
  createdAt: data.createdAt?.toDate() || new Date(),
  updatedAt: data.updatedAt?.toDate() || new Date(),
});

// Sample expenses for new users
const sampleExpenses = [
  {
    amount: 2500,
    description: 'Monthly Groceries',
    category: 'Food & Dining',
    date: new Date(2024, 2, 15),
  },
  {
    amount: 1800,
    description: 'Electricity Bill',
    category: 'Utilities',
    date: new Date(2024, 2, 10),
  },
  {
    amount: 1200,
    description: 'Movie Night',
    category: 'Entertainment',
    date: new Date(2024, 2, 8),
  },
  {
    amount: 5000,
    description: 'House Rent',
    category: 'Housing',
    date: new Date(2024, 2, 1),
  },
  {
    amount: 800,
    description: 'Bus Pass',
    category: 'Transportation',
    date: new Date(2024, 2, 5),
  },
];

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loading: false,
  error: null,
  filters: {},

  fetchExpenses: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      let q = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      // Apply filters
      if (filters.startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(filters.startDate)));
      }
      
      if (filters.endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(filters.endDate)));
      }
      
      if (filters.categories && filters.categories.length > 0) {
        q = query(q, where('category', 'in', filters.categories));
      }

      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const expense = convertFirestoreExpense(doc.id, doc.data());
        
        // Apply additional filters that can't be done in the query
        if (
          (filters.minAmount === undefined || expense.amount >= filters.minAmount) &&
          (filters.maxAmount === undefined || expense.amount <= filters.maxAmount) &&
          (filters.searchQuery === undefined || 
            expense.description.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        ) {
          expenses.push(expense);
        }
      });

      // If no expenses found, create sample expenses for new users
      if (expenses.length === 0) {
        const createPromises = sampleExpenses.map(expense => 
          addDoc(collection(db, 'expenses'), {
            ...expense,
            userId,
            date: Timestamp.fromDate(expense.date),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        );
        
        await Promise.all(createPromises);
        
        // Fetch again to get the created expenses with IDs
        return get().fetchExpenses(userId);
      }
      
      set({ expenses, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addExpense: async (expense) => {
    set({ loading: true, error: null });
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        date: Timestamp.fromDate(expense.date),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Refetch expenses
      await get().fetchExpenses(expense.userId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateExpense: async (id, expense) => {
    set({ loading: true, error: null });
    try {
      const expenseRef = doc(db, 'expenses', id);
      const updateData: any = {
        ...expense,
        updatedAt: serverTimestamp(),
      };
      
      // Convert date to Timestamp if it exists
      if (expense.date) {
        updateData.date = Timestamp.fromDate(expense.date);
      }
      
      await updateDoc(expenseRef, updateData);
      
      // Get the current expense to access userId
      const currentExpense = get().expenses.find(exp => exp.id === id);
      if (currentExpense) {
        // Refetch expenses
        await get().fetchExpenses(currentExpense.userId);
      }
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get the current expense to access userId before deletion
      const currentExpense = get().expenses.find(exp => exp.id === id);
      
      if (!currentExpense) {
        throw new Error('Expense not found');
      }
      
      const expenseRef = doc(db, 'expenses', id);
      await deleteDoc(expenseRef);
      
      // Refetch expenses
      await get().fetchExpenses(currentExpense.userId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters: () => {
    set({ filters: {} });
  }
}));