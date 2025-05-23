import { create } from "zustand";

interface ImportStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useImport = create<ImportStore>((set) => ({
  isOpen: false,
  onOpen: () => { set({isOpen: true}); },
  onClose: () => { set({isOpen: false}); }
}));