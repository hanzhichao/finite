"use client"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Input } from "@/components/ui/input";
import { deleteNote, getArchivedNotes, restoreNote } from "@/lib/notes";
import {Search, Trash, Undo, X} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Note } from "@/lib/types";
import { useActiveNote } from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {useCount} from "@/hooks/use-count";
import {ScrollArea} from "@/components/ui/scroll-area";

const TrashBox = () => {
  const [archiveNotes, setArchivedNotes] = useState<Note[]>([]);
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const { count, increase } = useCount()
  const [removeCount, setRemoveCount] = useState(0)
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("加载TrashBox组件")
    const fetchData = async () => {
      const notes: Note[] = await getArchivedNotes();
      setArchivedNotes(notes);
    };
    void fetchData();
  }, [count, removeCount]);


  const filteredNotes = archiveNotes.filter((note) => {
    return note.title.toLowerCase().includes(search.toLowerCase());
  });

  const onRestore = (event: React.MouseEvent<HTMLDivElement>, noteId: string) => {
    event.stopPropagation();
    const promise = restoreNote(noteId).then(r=>{increase()});
    toast.promise(promise, {
      loading: "Restoring notes...",
      success: "Note restored!",
      error: "Failed to restore note."
    });
  };

  const onRemove = (noteId: string) => {
    const promise = deleteNote(noteId).then(r=>{setRemoveCount(removeCount+1)});
    toast.promise(promise, {
      loading: "Deleting notes...",
      success: "Note deleted!",
      error: "Failed to delete note."
    });

    if (activeNoteId === noteId) {
      setActiveNoteId(undefined);
    }
  };

  const removeAll = async () => {
    for (const note of archiveNotes) {
      await deleteNote(note.id)
      if (activeNoteId === note.id) {
        setActiveNoteId(undefined);
      }
    }
  }

  const onRemoveAll = () => {
    const promise = removeAll().then(r=>{setRemoveCount(removeCount+1)});
    toast.promise(promise, {
      loading: "Deleting notes...",
      success: "Note deleted!",
      error: "Failed to delete note."
    });
  };

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-3">
        <Search className="h-5 w-5"/>
        <Input value={search} onChange={(e)=>{ setSearch(e.target.value); }}
        className="h-7 px-2 focus-visible:riging-transparent bg-secondary"
        placeholder="Filter by note title ..."/>
        <ConfirmDialog onConfirm={()=> { onRemoveAll(); }}>
          <Button variant="outline" size="icon" className="rounded-sm ml-1 h-7 w-7 cursor-pointer ">
            <X />
          </Button>
        </ConfirmDialog>
      </div>
      <ScrollArea className="h-72">
      <div className="mt-2 px-2 pb-5">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No notes found.
        </p>
        {filteredNotes.map((note, index)=>(
          <div key={index} role="button" onClick={()=>{ setActiveNoteId(note.id); }}
          className="text-sm rouned-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between">
            <span className="trancate pl-2">{note.title}</span>
            <div className="flex items-center">
              <div onClick={(e)=> { onRestore(e, note.id); }} role="button"
                className="rouned-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                <Undo className="h-4 w-4 text-muted-foreground"/>
              </div>
              <ConfirmDialog onConfirm={()=> { onRemove(note.id); }}>
                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <Trash className="h-4 w-4 text-muted-forground"/>
                </div>
              </ConfirmDialog>
            </div>
           
          </div>
        ))}
      </div>
      </ScrollArea>
    </div>
  )
}

export default TrashBox