import { create } from "zustand";

interface SidebarStore {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isResetting: boolean;
  setIsResetting: (value: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isCollapsed: false,
  isResetting: false,
  setIsCollapsed: (value) => { set({isCollapsed: value}); },
  setIsResetting: (value) => { set({isResetting: value}); },
}));