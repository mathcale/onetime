import create from 'zustand';
import type { Account } from '../types';

type State = {
  // Values
  accounts: Account[];

  // Mutations
  setAccounts: (accounts: Account[]) => void;
};

export const useStore = create<State>(set => ({
  // Values
  accounts: [],

  // Mutations
  setAccounts: accounts => set(() => ({ accounts })),
}));
