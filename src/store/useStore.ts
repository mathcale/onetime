import create from 'zustand';
import type { Account } from '../types';

type State = {
  // Values
  accounts: Account[];
  filteredAccounts: Account[];

  // Mutations
  setAccounts: (accounts: Account[]) => void;
  setFilteredAccounts: (filteredAccounts: Account[]) => void;
};

export const useStore = create<State>(set => ({
  // Values
  accounts: [],
  filteredAccounts: [],

  // Mutations
  setAccounts: accounts => set(() => ({ accounts })),
  setFilteredAccounts: filteredAccounts => set(() => ({ filteredAccounts })),
}));
