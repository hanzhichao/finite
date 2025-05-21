import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Item } from "@/components/sidebar/item";
import { FileIcon } from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import {getFavoriteNotes, getNotes} from "@/lib/notes";
import { Note } from "@/lib/types";
import { useChangedNotes } from "@/hooks/use-changed-notes";


export function FavoriteNotes() {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const isFavorite = useActiveNote((store) => store.isFavorite);
  const activeNoteTitle = useActiveNote((store) => store.activeNoteTitle);
  const activeNoteIcon = useActiveNote((store) => store.activeNoteIcon);
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);

  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>();

  useEffect(() => {
    console.log("加载FavoriteNotes组件");
    const fetchData = async () => {
      const notes: Note[] = await getFavoriteNotes();
      setFavoriteNotes(notes);
    };
    void fetchData();
  }, [activeNoteId, activeNoteTitle, activeNoteIcon]);

  // 选择笔记
  const onSelectNote = (noteId: string) => {
    setActiveNoteId(noteId)
  };

  return (
    <>
      {favoriteNotes?.map((note) => (
        <div key={note.id}>
          <Item
            onClick={() => { onSelectNote(note.id); }}
            label={note.title}
            icon={FileIcon}
            noteIcon={note.icon}
            active={activeNoteId === note.id}
          />
        </div>
      ))}
    </>
  );
}
