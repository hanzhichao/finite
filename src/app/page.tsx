"use client"

import {useActiveNote} from "@/hooks/use-active-note";
import {NoteEmpty} from "@/components/main/note-empty";
import {NoteMain} from "@/components/main/note-main";
import {NoteMarkMap} from "@/components/main/note-markmap";
import {NoteSubNotes} from "@/components/main/note-subnotes";

const Page = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const isMindView = useActiveNote((store) => store.isMindView);
  const isSubNotesView = useActiveNote((store) => store.isSubNotesView);

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
