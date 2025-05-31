import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  currency: string;
  toggleDarkMode: () => void;
  setCurrency: (currency: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      currency: 'INR',
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'theme-storage',
    }
  )
);