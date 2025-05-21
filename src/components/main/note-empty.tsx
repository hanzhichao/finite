import Image from "next/image";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {createNote} from "@/lib/notes";
import {toast} from "sonner";
import {useActiveNote} from "@/hooks/use-active-note";

export const NoteEmpty = ()=> {
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);

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

  return(
    <main className="h-full flex flex-col items-center justify-center space-y-4">
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
        Welcome to Finite
      </h2>
      <Button onClick={onCreateNote}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </main>
  )
}