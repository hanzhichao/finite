import {ListTree} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import { useShallow } from "zustand/react/shallow";
import {Button} from "@/components/ui/button";

export const NavbarMarkmap = () => {
  const {activeNoteId, isMindView, setMindView, setSubNotesView} = useActiveNote(useShallow((store) => ({
    activeNoteId: store.activeNoteId,
    isMindView: store.isMindView,
    setMindView: store.setMindView,
    setSubNotesView: store.setSubNotesView,
  })));

  const onSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setMindView(true)
          setSubNotesView(false)
        }, 100
      )
    }
  }

  const onUnSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setMindView(false)
        }, 100
      )
    }
  }

  return (
    <>
      {isMindView ? (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onUnSetMindView()
        }}>
          <ListTree className="text-amber-400 w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onSetMindView()
        }}>
          <ListTree className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
