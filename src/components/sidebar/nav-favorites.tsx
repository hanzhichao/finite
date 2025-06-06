import React, { useEffect, useState } from "react";
import { NoteItem } from "@/components/sidebar/note-item";
import { FileIcon } from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import {getFavoriteNotes, getNotes} from "@/lib/notes";
import { Note } from "@/lib/types";
import {useCount} from "@/hooks/use-count";
import { useTranslation } from "react-i18next";


export function NavFavorites() {
  const {activeNoteId,activeNoteTitle,activeNoteIcon,setActiveNoteId,isFavorite,updateActiveNoteIcon,updateActiveNoteTitle,setSubNotesView} =  useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    activeNoteTitle: store.activeNoteTitle,
    activeNoteIcon: store.activeNoteIcon,
    setActiveNoteId: store.setActiveNoteId,
    updateActiveNoteIcon: store.updateActiveNoteIcon,
    updateActiveNoteTitle: store.updateActiveNoteTitle,
    setSubNotesView: store.setSubNotesView,
    isFavorite: store.isFavorite,
  }))
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>();
  const count = useCount((store)=>store.count)
  const { t } = useTranslation();

  useEffect(() => {
    console.log("加载FavoriteNotes组件");
    const fetchData = async () => {
      const notes = await getFavoriteNotes();
      setFavoriteNotes(notes);
    };
    void fetchData();
  }, [activeNoteId, activeNoteTitle, activeNoteIcon, isFavorite, count]);

  // 选择笔记
  const onSelectNote = (noteId: string, title: string, icon: string) => {
    updateActiveNoteTitle(title)
    updateActiveNoteIcon(icon)
    setSubNotesView(false)
    setActiveNoteId(noteId)

  };

  return (
    <div className="mt-4">
      <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">{t("Favorites")}</span>
      {favoriteNotes?.map((note) => (
        <div key={note.id}>
          <NoteItem
            onClick={() => { onSelectNote(note.id, note.title, note.icon??""); }}
            label={note.title}
            icon={FileIcon}
            noteIcon={note.icon}
            active={activeNoteId === note.id}
          />
        </div>
      ))}
    </div>
  );
}
