import { create } from "zustand";

interface countStore {
  count: number;
  increase: ()  => void;
  setCount: (count: number) => void;
}

export const useCount = create<countStore>((set) => ({
  count: 0,
  increase: () => { set((store) => ({ count: store.count+1 })); },
  setCount: (count) => set({ count }),
}));
