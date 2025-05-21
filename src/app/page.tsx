"use client"
import { Cover } from "@/components/main/cover";
import { Toolbar } from "@/components/main/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import { createNote, getNote, updateNoteContent } from "@/lib/notes";
import { Note } from "@/lib/types";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const DocumentIdPage = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const setActiveNote = useActiveNote((store) => store.setActiveNote);
  const activeNoteCover = useActiveNote((store) => store.activeNoteCover);
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);
  const [note, setNote] = useState<Note>();

  const onCreateNote = () => {
    const promise = createNote("Untitled").then((noteId) =>
      { setActiveNoteId(noteId); }
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };
  
  useEffect(() => {
    console.log(`加载Page页面: activeNoteId=${activeNoteId}`);
    const fetchData = async () => {
      if (typeof activeNoteId === "undefined") {
        return;
      }
      const curNote: Note = await getNote(activeNoteId);
      console.log(curNote);
      if (typeof curNote === "undefined") {
        return;
      }
      setActiveNote(curNote);
      setNote(curNote);
    };
    void fetchData();
  }, [activeNoteId]);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/main/editor"), { ssr: false }),
    [activeNoteId]
  );

  if (activeNoteId === undefined) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image
          src="/empty.png"
          height="300"
          width="300"
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/empty-dark.png"
          height="300"
          width="300"
          alt="Empty"
          className="hidden dark:block"
        />
        <h2 className="text-lg font-medium">
          Welcome to Kevin&apos;s Finite
        </h2>
        <Button onClick={onCreateNote}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a note
        </Button>
      </div>
    );
  }

  const onContentChange = (content: string) => {
    console.log("处理Note内容更新");
    void updateNoteContent(activeNoteId, content);
  };

  if (note === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <Cover url={activeNoteCover}/>
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar initialData={note} />
        <Editor onChange={onContentChange} initialContent={note.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
