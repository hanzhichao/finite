import { create } from "zustand";

interface PropertiesStore {
  showProperties: boolean;
  togglePropertiesVisibility: ()  => void;
  setShowProperties: (value: boolean) => void;
  initShowProperties: (value: boolean) => void;
}

export const useProperties = create<PropertiesStore>((set) => ({
  showProperties: true,
  togglePropertiesVisibility: () => { set((store) => ({ showProperties: !store.showProperties })); },
  setShowProperties: (value: boolean) => { set({ showProperties: value }); },
  initShowProperties: (value: boolean) => {
    set((store) => {
      // only initialize once per app session
      // @ts-expect-error add hidden flag in store object
      if (store.__initialized) return store as any;
      return { ...(store as any), showProperties: value, __initialized: true };
    });
  }
}));
