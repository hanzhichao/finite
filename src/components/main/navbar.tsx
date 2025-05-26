import {MenuIcon} from "lucide-react";
import {NavbarTitle} from "@/components/main/navbar-title";
import {NoteBanner} from "@/components/main/note-banner";
import {NavbarMenu} from "@/components/main/navbar-menu";
import {useActiveNote} from "@/hooks/use-active-note";
import {NavbarFavorite} from "@/components/main/navbar-favorite";
import {NavbarLock} from "@/components/main/navbar-lock";
import {cn} from "@/lib/utils";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({isCollapsed, onResetWidth}: NavbarProps) => {
  const isArchived = useActiveNote((store) => store.isArchived);

  return (
    <>
      <nav data-tauri-drag-region className={cn("bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4 rounded-t-2xl",
        isCollapsed && "rounded-tl-2xl")}>
        {/*展开sidebar按钮*/}
        {isCollapsed && (
          <div className="cursor-pointer w-6 h-6 text-muted-foreground">
            <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6"/>
          </div>
        )}
        <div data-tauri-drag-region className="flex items-center justify-between w-full">
          <NavbarTitle/>
          <div className="flex items-center">
            <NavbarLock />
            <NavbarFavorite />
            <NavbarMenu/>
          </div>
        </div>
      </nav>
      {isArchived == 1 && <NoteBanner/>}
    </>
  );
};
