import {MenuIcon} from "lucide-react";
import {NavbarTitle} from "@/components/main/navbar-title";
import {NoteBanner} from "@/components/main/note-banner";
import {NavbarMenu} from "@/components/main/navbar-menu";
import {useActiveNote} from "@/hooks/use-active-note";
import {NavbarFavorite} from "@/components/main/navbar-favorite";
import {NavbarLock} from "@/components/main/navbar-lock";
// import {NavbarInfo} from "@/components/main/navbar-info";
import {cn} from "@/lib/utils";
import {NavbarMarkmap} from "@/components/main/navbar-markmap";
import {NavbarPresent} from "@/components/main/navbar-present";

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
          <div className="rounded-sm cursor-pointer w-6 h-6 text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6"/>
          </div>
        )}
        <div data-tauri-drag-region className="flex items-center justify-between w-full">
          <NavbarTitle/>
          <div className="flex items-center">
            {/*<NavbarInfo />*/}
            <NavbarPresent />
            <NavbarMarkmap />
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
