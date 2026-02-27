import { create } from "zustand";

interface SettingsStore {
  isOpen: boolean;
  wideMode: boolean;
  showProperties: boolean;
  defaultTitle: string;
  defaultIcon: string;
  showFavorites: boolean;
  showRecent: boolean;
  onOpen: () => void;
  onClose: () => void;
  setWideMode: (wide: boolean) => void;
  setShowProperties: (show: boolean) => void;
  setDefaultTitle: (title: string) => void;
  setDefaultIcon: (icon: string) => void;
  setShowFavorites: (show: boolean) => void;
  setShowRecent: (show: boolean) => void;
}

export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  wideMode: false,
  showProperties: true,
  defaultTitle: "Untitled",
  defaultIcon: "📄",
  showFavorites: true,
  showRecent: true,
  onOpen: () => { set({isOpen: true}); },
  onClose: () => { set({isOpen: false}); },
  setWideMode: (wide) => { set({ wideMode: wide }); },
  setShowProperties: (show) => { set({ showProperties: show }); },
  setDefaultTitle: (title) => { set({ defaultTitle: title }); },
  setDefaultIcon: (icon) => { set({ defaultIcon: icon }); },
  setShowFavorites: (show) => { set({ showFavorites: show }); },
  setShowRecent: (show) => { set({ showRecent: show }); },
}));