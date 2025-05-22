import {getNote, updateNoteContent} from "@/lib/notes";
import {useActiveNote} from "@/hooks/use-active-note";
import {useEffect, useMemo, useState} from "react";
import {Note} from "@/lib/types";
import dynamic from "next/dynamic";
import {NoteCover} from "@/components/main/note-cover";
import {Skeleton} from "@/components/ui/skeleton";
import {NoteHeader} from "@/components/main/note-header";

interface NoteMainProps {
  noteId: string;
}

export const NoteMain = ({noteId}: NoteMainProps)=> {
  const {activeNoteCover,isLocked,setActiveNote} = useActiveNote((store) => (
  { activeNoteCover: store.activeNoteCover,
    isLocked: store.isLocked,
    setActiveNote: store.setActiveNote}
  ));


  const [note, setNote] = useState<Note>();

  useEffect(() => {
    console.log(`加载Page页面: noteId=${noteId}`);
    const fetchData = async () => {
      const curNote: Note = await getNote(noteId);
      console.log(curNote);
      if (typeof curNote === "undefined") {
        return;
      }
      setActiveNote(curNote);
      setNote(curNote);
    };
    void fetchData();
  }, [noteId]);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/main/editor"), { ssr: false }),
    [noteId]
  );

  const onContentChange = (content: string) => {
    setTimeout(()=> {
      console.log("处理Note内容更新");
      void updateNoteContent(noteId, content)
    }, 300)
  };

  // Skeleton
  if (note === undefined) {
    return (
      <main className="">
        <NoteCover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-40">
      <NoteCover url={activeNoteCover} preview={isLocked==1}/>
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <NoteHeader initialData={note} preview={isLocked==1}/>
        {/*<Editor2 noteId={noteId} onChange={onContentChange} initialContent={note.content} editable={isLocked==0}/>*/}
        <Editor noteId={noteId} onChange={onContentChange} initialContent={note.content} editable={isLocked==0}/>
      </div>
    </main>
  );
}