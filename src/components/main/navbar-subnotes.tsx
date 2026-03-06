import {PanelTopOpen} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import { useShallow } from "zustand/react/shallow";
import {Button} from "@/components/ui/button";

export const NavbarSubNotes = () => {
  const {activeNoteId, isSubNotesView, setSubNotesView, setMindView} = useActiveNote(useShallow((store) => ({
    activeNoteId: store.activeNoteId,
    isMindView: store.isMindView,
    isSubNotesView: store.isSubNotesView,
    setSubNotesView: store.setSubNotesView,
    setMindView: store.setMindView,
  })));

  const onSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setSubNotesView(true)
          setMindView(false)
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
          <PanelTopOpen className="w-4 h-4 text-amber-400"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onSetMindView()
        }}>
          <PanelTopOpen className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
