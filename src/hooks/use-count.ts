import { create } from "zustand";

interface countStore {
  count: number;
  increase: ()  => void;
}

export const useCount = create<countStore>((set) => ({
  count: 0,
  increase: () => { set((store) => ({ count: store.count+1 })); }
}));
