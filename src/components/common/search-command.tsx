"use client"

import { useEffect, useState } from "react"
import {File} from "lucide-react"
import { useSearch } from "@/hooks/use-search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Note } from "@/lib/types";
import {getAllNotes, getNotes} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";

export const SearchCommand = () => {
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toggle = useSearch((store)=> store.toggle);
  const isOpen = useSearch((store)=> store.isOpen);
  const onClose = useSearch((store)=> store.onClose);

  useEffect(()=> {
    console.log("加载SearchCommand组件");
    const fetchData = async () => {
      const notes: Note[] = await getAllNotes();
      setNotes(notes);
    };
    void fetchData();
    setIsMounted(true)
  }, []);

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
            <CommandItem key={note.id} value={`${note.id}-${note.title}`} title={document.title} onSelect={onSelectNote}>
              {note.icon ? (<p className="mr-2 text-[18px]">{note.icon}</p>): (<File className="mr-2 text-[18px] w-18 h-18"/>)}
              <span>{note.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )

}