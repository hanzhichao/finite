import {Map} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {updateNoteIsFavorite} from "@/lib/notes";

export const NavbarMarkmap = () => {
  const {activeNoteId, isMindView, setMindView} = useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    isMindView: store.isMindView,
    setMindView: store.setMindView,
  }));

  const onSetMindView = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(
        () => {
          setMindView(true)
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
          <Map className="text-blue-400 w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onSetMindView()
        }}>
          <Map className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
