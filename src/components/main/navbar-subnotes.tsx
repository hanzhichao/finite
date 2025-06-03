import {LayoutList, Map} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {updateNoteIsFavorite} from "@/lib/notes";

export const NavbarSubNotes = () => {
  const {activeNoteId, isMindView,isSubNotesView, setSubNotesView} = useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    isMindView: store.isMindView,
    isSubNotesView: store.isSubNotesView,
    setSubNotesView: store.setSubNotesView,
  }));

  const onSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setSubNotesView(true)
        }, 100
      )
    }
  }

  const onUnSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setSubNotesView(false)
        }, 100
      )
    }
  }


  return (
    <>
      {isSubNotesView ? (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onUnSetMindView()
        }}>
          <LayoutList className="text-amber-400 w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onSetMindView()
        }}>
          <LayoutList className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
