import {Note, Property, PropertyType} from "@/lib/types";
import {create} from "zustand";

interface activeNoteStore {
  activeNoteId?: string;
  activeNoteTitle: string;
  activeNoteIcon: string;
  activeNoteCover: string;
  activeNoteContent: string;
  isFavorite: number;
  isArchived: number;
  isLocked: number;
  content: string,
  markdown: string,
  updateAt: string,
  tags: string[],  // todo remove
  setActiveNoteId: (id?: string) => void;
  setActiveNote: (note: Note) => void;
  updateActiveNoteTitle: (title: string) => void;
  updateActiveNoteIcon: (icon: string) => void;
  updateActiveNoteCover: (cover: string) => void;
  updateActiveNoteContent: (content: string) => void;
  favoriteNote: () => void;
  unFavoriteNote: () => void;
  restoreActiveNote: () => void;
  lockNote: () => void;
  unLockNote: () => void;
  updateActiveNoteTags: (tags: string[])=> void;
  updateContent: (content: string) => void;
  properties: Property[];
  updateProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  contentChangeCount: number,
  increaseContentChangeCount: () => void;
  isMindView: boolean,
  isSubNotesView: boolean,
  isCalendarView: boolean,
  isPresentView: boolean,
  setMindView: (value: boolean) => void,
  setSubNotesView: (value: boolean) => void,
  setCalendarView: (value: boolean) => void,
  setPresentView: (value: boolean) => void,
  noteHistory: string[],
  goBack: () => void,
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
  properties: [],
  noteHistory: [],
  setActiveNoteId: (id?: string) => {
    const prev = get().activeNoteId;
    if (prev && prev !== id) {
      set((s) => ({ noteHistory: [...s.noteHistory, prev] }));
    }
    set({ activeNoteId: id });
  },
  setActiveNote: (note: Note) =>
    { set({
      activeNoteTitle: note.title,
      activeNoteCover: note.cover,
      activeNoteIcon: note.icon || "",
      activeNoteContent: note.content,
      isFavorite: note.is_favorite,
      isArchived: note.is_archived,
      updateAt: note.update_at,
      isLocked: note.is_locked,
      tags: note.tags ? note.tags.split(",") : [],
      content: note.content,
      properties: note.properties,
      markdown: note.markdown,
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
  addProperty: (property: Property) => {set((store)=>({properties: [...store.properties, property]}))},
  updateProperties: (properties: Property[]) => {set({properties: properties})},
  contentChangeCount: 0,
  increaseContentChangeCount: () => {set((store)=>({contentChangeCount: store.contentChangeCount + 1}))},
  isMindView: false,
  isSubNotesView: false,
  isCalendarView: false,
  isPresentView: false,
  markdown: "",
  setMindView: (value: boolean) => {set({isMindView: value})},
  setSubNotesView: (value: boolean) => {set({isSubNotesView: value})},
  setCalendarView: (value: boolean) => {set({isCalendarView: value})},
  setPresentView: (value: boolean) => {set({isPresentView: value})},
  goBack: () => {
    const history = get().noteHistory;
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    set({
      noteHistory: history.slice(0, -1),
      activeNoteId: prevId,
      isMindView: false,
      isSubNotesView: false,
      isPresentView: false,
    });
  },
  }));
