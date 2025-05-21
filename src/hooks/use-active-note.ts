import { Note } from "@/lib/types";
import { create } from "zustand";

interface activeNoteStore {
  activeNoteId?: string;
  activeNoteTitle: string;
  activeNoteIcon: string;
  activeNoteCover: string;
  activeNoteContent: string;
  isFavorite: number;
  isArchived: number;
  setActiveNoteId: (id?: string) => void;
  setActiveNote: (note: Note) => void;
  updateActiveNoteTitle: (title: string) => void;
  updateActiveNoteIcon: (icon: string) => void;
  updateActiveNoteCover: (cover: string) => void;
  updateActiveNoteContent: (content: string) => void;
  favoriteNote: () => void;
  unFavoriteNote: () => void;
  updateAt: string,
  restoreActiveNote: () => void;
}

export const useActiveNote = create<activeNoteStore>((set, get) => ({
  activeNoteId: undefined,
  activeNoteTitle: "",
  activeNoteIcon: "🏠",
  activeNoteCover: "",
  activeNoteContent: "",
  isFavorite: 0,
  isArchived: 0,
  updateAt: "",
  setActiveNoteId: (id?: string) => { set({ activeNoteId: id }); },
  setActiveNote: (note: Note) =>
    { set({
      activeNoteId: note.id,
      activeNoteTitle: note.title,
      activeNoteCover: note.cover,
      activeNoteIcon: note.icon,
      activeNoteContent: note.content,
      isFavorite: note.is_favorite,
      isArchived: note.is_archived,
      updateAt: note.update_at,
    }); },
  updateActiveNoteTitle: (title: string) => { set({ activeNoteTitle: title }); },
  updateActiveNoteIcon: (icon: string) => { set({ activeNoteIcon: icon }); },
  updateActiveNoteCover: (cover: string) => { set({ activeNoteCover: cover }); },
  updateActiveNoteContent: (content: string) =>
    { set({ activeNoteContent: content }); },
  favoriteNote: () => { set({ isFavorite: 1 }); },
  unFavoriteNote: () => { set({ isFavorite: 0 }); },
  restoreActiveNote: ()=> { set({ isArchived: 0 }); },
  }));
