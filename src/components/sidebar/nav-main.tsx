import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import {NavNotes} from "@/components/sidebar/nav-notes";
import { createNote } from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {NavFavorites} from "@/components/sidebar/nav-favorites";
import {NavTrash} from "@/components/sidebar/nav-trash";
import {NavItems} from "@/components/sidebar/nav-items";
import {useEffect} from "react";

export function NavMain() {
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(()=> {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        onCreateNote();
      }
    }
    document.addEventListener("keydown", down);
    return () => { document.removeEventListener("keydown", down); };
  }, []);

  const onCreateNote = () => {
    const promise = createNote("Untitled").then((noteId) =>
      { setActiveNoteId(noteId); }
    );
    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create note.",
    });
  };

  return (
    <div>
      <NavItems onCreateNote={onCreateNote}/>
      <NavFavorites />
      <NavNotes onCreateNote={onCreateNote}/>
      <NavTrash isMobile={isMobile} />
    </div>
  );
}
