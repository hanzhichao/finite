import { create } from "zustand";
import {BlockNoteEditor} from "@blocknote/core";

interface EditorStore {
  editor?: BlockNoteEditor;
  setEditor: (value: BlockNoteEditor) => void;
}

export const useEditor = create<EditorStore>((set) => ({
  editor: undefined,
  setEditor: (value: BlockNoteEditor) => { set({editor: value}); },
}));