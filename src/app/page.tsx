"use client"

import {useActiveNote} from "@/hooks/use-active-note";
import {NoteEmpty} from "@/components/main/note-empty";
import {NoteMain} from "@/components/main/note-main";

const Page = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  return (
    <>
      {activeNoteId ? (
        <NoteMain noteId={activeNoteId}/>
      ) : (
        <NoteEmpty/>
      )}
    </>
  )
};
export default Page;
