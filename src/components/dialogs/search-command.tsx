"use client"

import { useEffect, useState } from "react"
import {Clock, File} from "lucide-react"
import { useSearch } from "@/hooks/use-search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Note } from "@/lib/types";
import {getRecentUpdatedNotes} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";

export const SearchCommand = () => {
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toggle = useSearch((store)=> store.toggle);
  const isOpen = useSearch((store)=> store.isOpen);
  const onClose = useSearch((store)=> store.onClose);

  useEffect(()=> {
    setIsMounted(true)
  }, []);

  useEffect(()=> {
    if (!isOpen) return;
    const fetchData = async () => {
      const notes: Note[] = await getRecentUpdatedNotes(20);
      setNotes(notes);
    };
    void fetchData();
  }, [isOpen]);

  useEffect(()=> {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", down);
    return () => { document.removeEventListener("keydown", down); };
  }, [toggle]); 

  const onSelectNote = (noteId: string) => {
    setActiveNoteId(noteId)
    onClose();
  }

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search Finite...`}/>
      <CommandList>
        <CommandEmpty>No Results found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {notes.map((note)=>(
            <CommandItem key={note.id} value={`${note.id}-${note.title}`} title={document.title} onSelect={()=>{onSelectNote(note.id)}}>
              {note.icon ? (<p className="mr-1 text-[15px]">{note.icon}</p>): (<File className="mr-2 text-[18px] w-18 h-18"/>)}
              <div className="flex flex-1 justify-between items-center">
                <span>{note.title}</span>
                <span className="flex gap-x-1 text-muted-foreground text-xs">
                  <Clock />
                  {note.update_at}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )

}