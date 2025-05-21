import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Item } from "@/components/sidebar/item";
import { FileIcon } from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import { getNotes } from "@/lib/notes";
import { Note } from "@/lib/types";
import { useChangedNotes } from "@/hooks/use-changed-notes";

interface NoteListProps {
  parentId?: string;
  level?: number;
}

export function NoteList({parentId,level = 0}: NoteListProps) {
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
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
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
          <Item id={note.id}
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
