import {MenuIcon, Star} from "lucide-react";
import { Title } from "@/components/main/title";
import { Banner } from "@/components/main/banner";
import { Menu } from "@/components/main/menu";
import { useActiveNote } from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {updateNoteFavorite} from "@/lib/notes";
import {useSidebar} from "@/hooks/use-sidebar";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const isArchived = useActiveNote((store) => store.isArchived);
  const isFavorite = useActiveNote((store) => store.isFavorite);
  const favoriteNote = useActiveNote((store) => store.favoriteNote);
  const unFavoriteNote = useActiveNote((store) => store.unFavoriteNote);

  const isCollapsed = useSidebar((store)=>store.isCollapsed)
  const onResetWidth = useSidebar((store)=>store.onResetWidth)

  const onFavoriteNote = () => {
    if (typeof activeNoteId !== "undefined"){
      favoriteNote()
      void updateNoteFavorite(activeNoteId, 1)
    }
  }

  const onUnFavoriteNote = () => {
    if (typeof activeNoteId !== "undefined"){
      unFavoriteNote()
      void updateNoteFavorite(activeNoteId, 0)
    }
  }


  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={()=> {onResetWidth()}}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title />
          <div className="flex items-center">
            {isFavorite == 1 ? (
              <Button size="sm" variant="ghost"  onClick={()=>{onUnFavoriteNote()}}>
                <Star className="text-amber-400 fill-amber-400 w-4 h-4"/>
              </Button>
            ) : (
                <Button size="sm" variant="ghost" onClick={()=>{onFavoriteNote()}}>
                  <Star className="w-4 h-4"/>
                </Button>
              )
            }
            <Menu />
          </div>
        </div>
      </nav>
      {isArchived == 1 && <Banner />}
    </>
  );
};
