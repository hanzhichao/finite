import { create } from "zustand";

interface SettingsStore {
  isOpen: boolean;
  wideMode: boolean;
  showProperties: boolean;
  defaultTitle: string;
  defaultIcon: string;
  showFavorites: boolean;
  showRecent: boolean;
  presentAutoSplitByHeading: boolean;
  presentSplitHeadingLevel: number;
  presentTheme: string;
  presentTransition: string;
  presentNoteThemes: Record<string, string>;
  onOpen: () => void;
  onClose: () => void;
  setWideMode: (wide: boolean) => void;
  setShowProperties: (show: boolean) => void;
  setDefaultTitle: (title: string) => void;
  setDefaultIcon: (icon: string) => void;
  setShowFavorites: (show: boolean) => void;
  setShowRecent: (show: boolean) => void;
  setPresentAutoSplitByHeading: (enabled: boolean) => void;
  setPresentSplitHeadingLevel: (level: number) => void;
  setPresentTheme: (theme: string) => void;
  setPresentTransition: (transition: string) => void;
  setPresentNoteTheme: (noteId: string, theme: string) => void;
}

export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  wideMode: false,
  showProperties: true,
  defaultTitle: "Untitled",
  defaultIcon: "📄",
  showFavorites: true,
  showRecent: true,
  presentAutoSplitByHeading: true,
  presentSplitHeadingLevel: 3,
  presentTheme: "default",
  presentTransition: "fade",
  presentNoteThemes: {},
  onOpen: () => { set({isOpen: true}); },
  onClose: () => { set({isOpen: false}); },
  setWideMode: (wide) => { set({ wideMode: wide }); },
  setShowProperties: (show) => { set({ showProperties: show }); },
  setDefaultTitle: (title) => { set({ defaultTitle: title }); },
  setDefaultIcon: (icon) => { set({ defaultIcon: icon }); },
  setShowFavorites: (show) => { set({ showFavorites: show }); },
  setShowRecent: (show) => { set({ showRecent: show }); },
  setPresentAutoSplitByHeading: (enabled) => { set({ presentAutoSplitByHeading: enabled }); },
  setPresentSplitHeadingLevel: (level) => { set({ presentSplitHeadingLevel: level }); },
  setPresentTheme: (theme) => { set({ presentTheme: theme }); },
  setPresentTransition: (transition) => { set({ presentTransition: transition }); },
  setPresentNoteTheme: (noteId, theme) => { set((s) => ({ presentNoteThemes: { ...s.presentNoteThemes, [noteId]: theme } })); },
}));