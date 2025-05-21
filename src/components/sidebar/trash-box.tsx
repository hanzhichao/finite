"use client"

import { ConfirmModal } from "@/components/dialogs/confirm-dialog";
import { Input } from "@/components/ui/input";
import { deleteNote, getArchivedNotes, restoreNote } from "@/lib/notes";
import { Search, Trash, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Note } from "@/lib/types";
import { useActiveNote } from "@/hooks/use-active-note";

export const TrashBox = () => {
  const [archiveNotes, setArchivedNotes] = useState<Note[]>([]);
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)

  useEffect(() => {
    console.log("执行TrashBox-useEffect-getAchivedNotes")
    const fetchData = async () => {
      const notes: Note[] = await getArchivedNotes();
      setArchivedNotes(notes);
    };
    void fetchData();
  }, []);


  const [search, setSearch] = useState("");

  const filteredNotes = archiveNotes.filter((note) => {
    return note.title.toLowerCase().includes(search.toLowerCase());
  });

  // const onClick = (documentId: string) => {
  //   router.push(`/documents/${documentId}`);
  // };

  const onRestore = (event: React.MouseEvent<HTMLDivElement>, noteId: string) => {
    event.stopPropagation();
    const promise = restoreNote(noteId);
    toast.promise(promise, {
      loading: "Restoring notes...",
      success: "Note restored!",
      error: "Failed to restore note."
    });
  };

  const onRemove = (noteId: string) => {
    const promise = deleteNote(noteId);

    toast.promise(promise, {
      loading: "Deleting notes...",
      success: "Note deleted!",
      error: "Failed to delete note."
    });

    if (activeNoteId === noteId) {
      setActiveNoteId(undefined);
    }
  };

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4"/>
        <Input value={search} onChange={(e)=>{ setSearch(e.target.value); }}
        className="h-7 px-2 focus-visible:riging-transparent bg-secondary"
        placeholder="Filter by pate title..."/>
      </div>
      <div className="mt-2 px-2 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
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
              <ConfirmModal onConfirm={()=> { onRemove(note.id); }}>
                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <Trash className="h-4 w-4 text-muted-forground"/>
                </div>
              </ConfirmModal>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  )
}