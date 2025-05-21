import { create } from "zustand";

interface SidebarStore {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  onResetWidth: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isCollapsed: false,
  setIsCollapsed: (value) => { set({isCollapsed: value}); },
  onResetWidth: () => { set({isCollapsed: false}); },
}));