import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NoteItem } from "@/components/sidebar/note-item";
import {FileIcon, Plus} from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import { getNotes, updateNoteParent } from "@/lib/notes";
import { Note } from "@/lib/types";
import {useCount} from "@/hooks/use-count";
import { useTranslation } from "react-i18next";

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
  const updateActiveNoteTitle = useActiveNote((store) => store.updateActiveNoteTitle);
  const updateActiveNoteIcon = useActiveNote((store) => store.updateActiveNoteIcon);
  const setSubNotesView = useActiveNote((store) => store.setSubNotesView);
  const setMindView = useActiveNote((store) => store.setMindView);
  const setCalendarView = useActiveNote((store) => store.setCalendarView);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Note[]>();
  const count = useCount((store)=>store.count)
  const setCount = useCount((store)=>store.setCount)


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
  }, [activeNoteId, activeNoteTitle, activeNoteIcon, count]);

  // 选择笔记
  const onSelectNote = (noteId: string, title: string, icon: string) => {
    if(noteId != activeNoteId){
      updateActiveNoteTitle(title)
      updateActiveNoteIcon(icon)
      setCalendarView(false)
      setMindView(false)
      setSubNotesView(false)
      setActiveNoteId(noteId)
    }
  };

  // 拖拽更改 parent
  const handleDrop = async (fromId: string, toId: string) => {
    if (fromId && fromId !== toId) {
      await updateNoteParent(fromId, toId);
      setCount(count + 1);
    }
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
      <p
        className={cn( `hidden text-sm font-medium text-muted-foreground/80`,expanded && "last:block",level === 0 && "hidden")}
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
      >
        No pages available
      </p>
      {notes.map((note) => (
        <div key={note.id}>
          <NoteItem
            id={note.id}
            onClick={() => { onSelectNote(note.id, note.title, note.icon??""); }}
            label={note.title}
            icon={FileIcon}
            noteIcon={note.icon}
            active={activeNoteId === note.id}
            level={level}
            onExpand={() => { onExpand(note.id); }}
            expanded={expanded[note.id]}
            updateAt={note.update_at}
            onDrop={(fromId: string, toId: string) => handleDrop(fromId, toId)}
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
  const { t } = useTranslation();
  return (
    <div className="mt-4">
      <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">{t("Notes")}</span>
      <NoteList />
      <NoteItem onClick={onCreateNote} icon={Plus} label={t("Add a page")} />
    </div>
  )
}
