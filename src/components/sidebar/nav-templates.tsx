import React, { useEffect, useState } from "react";
import { NoteItem } from "@/components/sidebar/note-item";
import { FileIcon } from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import {getTemplates} from "@/lib/notes";
import { Note } from "@/lib/types";
import {useCount} from "@/hooks/use-count";


export function NavTemplates() {
  const {activeNoteId,activeNoteTitle,activeNoteIcon,setActiveNoteId,isFavorite} =  useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    activeNoteTitle: store.activeNoteTitle,
    activeNoteIcon: store.activeNoteIcon,
    setActiveNoteId: store.setActiveNoteId,
    isFavorite: store.isFavorite,
  }))
  const [templates, setTemplates] = useState<Note[]>();
  const count = useCount((store)=>store.count)

  useEffect(() => {
    console.log("加载NavTemplates组件");
    const fetchData = async () => {
      const result = await getTemplates();
      setTemplates(result);
    };
    void fetchData();
  }, [activeNoteId, activeNoteTitle, activeNoteIcon, isFavorite, count]);

  // 选择笔记
  const onSelectNote = (noteId: string) => {
    setActiveNoteId(noteId)
  };

  return (
    <div className="mt-4">
      <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">Templates</span>
      {templates?.map((note) => (
        <div key={note.id}>
          <NoteItem
            onClick={() => { onSelectNote(note.id); }}
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
