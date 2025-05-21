import { Note } from "@/lib/types";
import { create } from "zustand";

interface changedNotesStore {
  changedNotes: Map<string, Note>;
  updateChangedNote: (noteId: string, title: string, icon:  string|undefined) => void;
  getChangedNote: (noteId: string) => Note | null;
  clearChangedNotes: () => void;
}

export const useChangedNotes = create<changedNotesStore>((set, get) => ({
  changedNotes: new Map<string, Note>(),
  updateChangedNote: (noteId: string, title: string, icon: string|undefined) =>
    { set((state) => {
      const changedNotes = { ...state.changedNotes }
      const originNote = state.changedNotes.get(noteId);
      if (originNote != null) {
        const newNote: Note = { ...originNote, title: title, icon: icon };
        state.changedNotes.set(noteId, newNote);
      } else {
        const newNote: Note = { id:noteId , title: title, icon: icon };
        state.changedNotes.set(noteId, newNote);
      }
      return {changedNotes}
}); },
  getChangedNote: (noteId: string) => {
    const state = get();
    return state.changedNotes.get(noteId) ?? null; // 如果学生不存在，返回 null
  },
  clearChangedNotes: () => { set({changedNotes: new Map<string, Note>()} ); }

}));
