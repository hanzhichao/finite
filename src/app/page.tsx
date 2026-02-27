"use client"

import {useActiveNote} from "@/hooks/use-active-note";
import {NoteEmpty} from "@/components/main/note-empty";
import {NoteMain} from "@/components/main/note-main";
import {NoteMarkMap} from "@/components/main/note-markmap";
import {NoteSubNotes} from "@/components/main/note-subnotes";
import {NoteCalendar} from "@/components/main/note-calendar";

const Page = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const isMindView = useActiveNote((store) => store.isMindView);
  const isSubNotesView = useActiveNote((store) => store.isSubNotesView);
  const isCalendarView = useActiveNote((store) => store.isCalendarView);

  if (isCalendarView) return (
    <NoteCalendar />
  )

  if (!activeNoteId) return (
    <NoteEmpty/>
  )

  if (isSubNotesView) return (
    <NoteSubNotes noteId={activeNoteId}/>
  )

  if (isMindView) return (
    <NoteMarkMap noteId={activeNoteId}/>
  )

  return (
    <NoteMain noteId={activeNoteId}/>
  )
}

export default Page;
