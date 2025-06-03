"use client"

import {useActiveNote} from "@/hooks/use-active-note";
import {NoteEmpty} from "@/components/main/note-empty";
import {NoteMain} from "@/components/main/note-main";
import {NoteMarkmap} from "@/components/main/note-markmap";

const Page = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const isMindView = useActiveNote((store) => store.isMindView);
  return (
    <>
      {activeNoteId ? (
        <>
          {isMindView ? (
            <NoteMarkmap/>
          ) : (
            <NoteMain noteId={activeNoteId}/>
          )}
        </>
      ) : (
        <NoteEmpty/>
      )}
    </>
  )
};
export default Page;
