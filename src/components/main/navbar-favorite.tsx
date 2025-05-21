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
      favoriteNote()
      void updateNoteIsFavorite(activeNoteId, 1)
    }
  }

  const onUnFavoriteNote = () => {
    if (typeof activeNoteId !== "undefined") {
      unFavoriteNote()
      void updateNoteIsFavorite(activeNoteId, 0)
    }
  }

  return (
    <>
      {isFavorite == 1 ? (
        <Button size="sm" variant="ghost" onClick={() => {
          onUnFavoriteNote()
        }}>
          <Star className="text-amber-400 fill-amber-400 w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => {
          onFavoriteNote()
        }}>
          <Star className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
