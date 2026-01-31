import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'debtinator-storage' });

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
};

interface IncomeState {
  monthlyIncome: number;
  setMonthlyIncome: (amount: number) => void;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
      monthlyIncome: 0,
      setMonthlyIncome: (monthlyIncome) => set({ monthlyIncome }),
    }),
    { name: 'income-storage', storage: createJSONStorage(() => mmkvStorage) }
  )
);
