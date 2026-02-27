"use client"

import { useEffect, useState } from "react"
import {Clock, File} from "lucide-react"
import { useSearch } from "@/hooks/use-search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Note } from "@/lib/types";
import {getRecentUpdatedNotes, searchNotesAdvanced} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import { useTranslation } from "react-i18next";

export const SearchCommand = () => {
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const updateActiveNoteIcon = useActiveNote((store)=> store.updateActiveNoteIcon)
  const updateActiveNoteTitle = useActiveNote((store)=> store.updateActiveNoteTitle)
  const setSubNotesView = useActiveNote((store)=> store.setSubNotesView)
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toggle = useSearch((store)=> store.toggle);
  const isOpen = useSearch((store)=> store.isOpen);
  const onClose = useSearch((store)=> store.onClose);
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  useEffect(()=> {
    setIsMounted(true)
  }, []);

  useEffect(()=> {
    if (!isOpen) return;

    const fetchData = async () => {
      if (!query.trim()) {
        const recent: Note[] = await getRecentUpdatedNotes(20);
        setNotes(recent);
        return;
      }

      const tokens = query.split(/\s+/).filter(Boolean);
      const tagTokens = tokens.filter((t) => t.startsWith("#")).map((t) => t.slice(1));
      const propToken = tokens.find((t) => t.includes(":") && !t.startsWith("#"));

      let keywordTokens = tokens.filter((t) => !t.startsWith("#") && t !== propToken);
      const keyword = keywordTokens.join(" ");

      let propertyKey: string | undefined;
      let propertyValue: string | undefined;
      if (propToken) {
        const [k, v] = propToken.split(":", 2);
        if (k && v) {
          propertyKey = k;
          propertyValue = v;
        }
      }

      const result = await searchNotesAdvanced({
        keyword,
        tags: tagTokens,
        propertyKey,
        propertyValue,
        limit: 50,
      });
      setNotes(result);
    };

    void fetchData();
  }, [isOpen, query]);

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

  const onSelectNote = (noteId: string, title: string, icon: string) => {
    updateActiveNoteTitle(title)
    updateActiveNoteIcon(icon)
    setSubNotesView(false)
    setActiveNoteId(noteId)
    onClose();
  }

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={t("Search Finite...")}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{t("No Results found.")}</CommandEmpty>
        <CommandGroup heading={t("Notes")}>
          {notes.map((note)=>(
            <CommandItem key={note.id} value={`${note.id}-${note.title}`} title={document.title} onSelect={()=>{onSelectNote(note.id, note.title, note.icon??"")}}>
              {note.icon ? (<p className="mr-1 text-[15px]">{note.icon}</p>): (<File className="mr-2 text-[18px] w-18 h-18"/>)}
              <div className="flex flex-1 justify-between items-center cursor-pointer">
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