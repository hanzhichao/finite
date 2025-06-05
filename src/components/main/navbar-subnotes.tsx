import {LayoutList, ChevronDown, ChevronRight} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";

export const NavbarSubNotes = () => {
  const {activeNoteId, isMindView,isSubNotesView, setSubNotesView, setMindView} = useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    isMindView: store.isMindView,
    isSubNotesView: store.isSubNotesView,
    setSubNotesView: store.setSubNotesView,
    setMindView: store.setMindView,
  }));

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
          <ChevronRight className="w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onSetMindView()
        }}>
          <ChevronDown className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
