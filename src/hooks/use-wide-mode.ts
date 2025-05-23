import { create } from "zustand";

interface wideModeStore {
  wideMode: boolean;
  toggleWideMode: ()  => void;
}

export const useWideMode = create<wideModeStore>((set) => ({
  wideMode: false,
  toggleWideMode: () => { set((store) => ({ wideMode: !store.wideMode })); }
}));
