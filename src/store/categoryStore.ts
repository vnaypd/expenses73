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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  fetchCategories: (userId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id' | 'userId'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const defaultCategories = [
  { name: 'Food & Dining', color: '#F59E0B', icon: 'utensils' },
  { name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { name: 'Housing', color: '#10B981', icon: 'home' },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'film' },
  { name: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
  { name: 'Utilities', color: '#6B7280', icon: 'zap' },
  { name: 'Healthcare', color: '#EF4444', icon: 'heart' },
  { name: 'Personal', color: '#0EA5E9', icon: 'user' },
  { name: 'Education', color: '#14B8A6', icon: 'book' },
  { name: 'Travel', color: '#F97316', icon: 'plane' },
  { name: 'Other', color: '#6B7280', icon: 'more-horizontal' }
];

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', userId),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });
      
      // If no categories found, create default categories
      if (categories.length === 0) {
        const createPromises = defaultCategories.map(category => 
          addDoc(collection(db, 'categories'), {
            ...category,
            userId,
            createdAt: serverTimestamp(),
          })
        );
        
        await Promise.all(createPromises);
        
        // Fetch again to get the created categories with IDs
        return get().fetchCategories(userId);
      }
      
      set({ categories, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp(),
      });
      
      // Refetch categories
      await get().fetchCategories(category.userId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ loading: true, error: null });
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, category);
      
      // Get the current category to access userId
      const currentCategory = get().categories.find(cat => cat.id === id);
      if (currentCategory) {
        // Refetch categories
        await get().fetchCategories(currentCategory.userId);
      }
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get the current category to access userId before deletion
      const currentCategory = get().categories.find(cat => cat.id === id);
      
      if (!currentCategory) {
        throw new Error('Category not found');
      }
      
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);
      
      // Refetch categories
      await get().fetchCategories(currentCategory.userId);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));