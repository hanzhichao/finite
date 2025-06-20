import { create } from "zustand";

interface PropertiesStore {
  showProperties: boolean;
  togglePropertiesVisibility: ()  => void;
}

export const useProperties = create<PropertiesStore>((set) => ({
  showProperties: false,
  togglePropertiesVisibility: () => { set((store) => ({ showProperties: !store.showProperties })); }
}));
