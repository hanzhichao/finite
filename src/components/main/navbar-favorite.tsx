import {Star} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {updateNoteIsFavorite} from "@/lib/notes";

export const NavbarFavorite = () => {
  const {activeNoteId, isFavorite, favoriteNote, unFavoriteNote} = useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    isFavorite: store.isFavorite,
    favoriteNote: store.favoriteNote,
    unFavoriteNote: store.unFavoriteNote,
  }));

  const onFavoriteNote = () => {
    if (typeof activeNoteId !== "undefined") {
      void updateNoteIsFavorite(activeNoteId, 1)
      setTimeout(
        () => {
          favoriteNote()
        }, 100
      )
    }
  }

  const onUnFavoriteNote = () => {
    if (typeof activeNoteId !== "undefined") {
      void updateNoteIsFavorite(activeNoteId, 0)
      setTimeout(
        () => {
          unFavoriteNote()
        }, 100
      )
    }
  }

  return (
    <>
      {isFavorite == 1 ? (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onUnFavoriteNote()
        }}>
          <Star className="text-amber-400 fill-amber-400 w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          onFavoriteNote()
        }}>
          <Star className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
