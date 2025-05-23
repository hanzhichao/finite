import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NoteItem } from "@/components/sidebar/note-item";
import {FileIcon, Plus} from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import { getNotes } from "@/lib/notes";
import { Note } from "@/lib/types";

interface NoteListProps {
  parentId?: string;
  level?: number;
}

interface NavNotesProps {
  onCreateNote: () => void;
}


const NoteList = ({parentId,level = 0}: NoteListProps) => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const activeNoteTitle = useActiveNote((store) => store.activeNoteTitle);
  const activeNoteIcon = useActiveNote((store) => store.activeNoteIcon);
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Note[]>();

  const onExpand = (noteId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [noteId]: !prevExpanded[noteId],
    }));
  };
           
  useEffect(() => {
    console.log("加载NoteList组件");
    const fetchData = async () => {
      let notes: Note[];
      if (typeof parentId!=="undefined"){
        notes = await getNotes(parentId);
      } else {
        notes = await getNotes();
      }
      setNotes(notes);
    };
    void fetchData();
  }, [activeNoteId, activeNoteTitle, activeNoteIcon]);

  // 选择笔记
  const onSelectNote = (noteId: string) => {
    setActiveNoteId(noteId)
  };

  // 数据库没有笔记
  if (notes === undefined) {
    return (
      <>
        <NoteItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <NoteItem.Skeleton level={level} />
            <NoteItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p className={cn( `hidden text-sm font-medium text-muted-foreground/80`,expanded && "last:block",level === 0 && "hidden")} style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}>
        No pages available
      </p>
      {notes.map((note) => (
        <div key={note.id}>
          <NoteItem id={note.id}
                    onClick={() => { onSelectNote(note.id); }}
                    label={note.title}
                    icon={FileIcon}
                    noteIcon={note.icon}
                    active={activeNoteId === note.id}
                    level={level}
                    onExpand={() => { onExpand(note.id); }}
                    expanded={expanded[note.id]}
                    updateAt={note.update_at}
          />
          {expanded[note.id] && (
            <NoteList parentId={note.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}

export function NavNotes ({onCreateNote}: NavNotesProps) {
  return (
    <div className="mt-4">
      <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">Notes</span>
      <NoteList />
      <NoteItem onClick={onCreateNote} icon={Plus} label="Add a page" />
    </div>
  )
}
