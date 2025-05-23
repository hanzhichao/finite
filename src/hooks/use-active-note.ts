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
  isLocked: number;
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
  lockNote: () => void;
  unLockNote: () => void;
  tags: string[],
  updateActiveNoteTags: (tags: string[])=> void;
  content: string,
  updateContent: (content: string) => void;

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
  isLocked: 0,
  tags: [],
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
      isLocked: note.is_locked,
      tags: note.tags ? note.tags.split(",") : [],
      content: note.content,
    }); },
  updateActiveNoteTitle: (title: string) => { set({ activeNoteTitle: title }); },
  updateActiveNoteIcon: (icon: string) => { set({ activeNoteIcon: icon }); },
  updateActiveNoteCover: (cover: string) => { set({ activeNoteCover: cover }); },
  updateActiveNoteContent: (content: string) =>
    { set({ activeNoteContent: content }); },
  favoriteNote: () => { set({ isFavorite: 1 }); },
  unFavoriteNote: () => { set({ isFavorite: 0 }); },
  restoreActiveNote: ()=> { set({ isArchived: 0 }); },
  lockNote: ()=> { set({ isLocked: 1 }); },
  unLockNote: ()=> { set({ isLocked: 0 }); },
  updateActiveNoteTags: (value: string[]) => { set({ tags: value }); },
  content: "",
  updateContent: (content: string) => {set({content: content})},
  }));
