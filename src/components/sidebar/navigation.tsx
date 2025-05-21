"use client"

import React, { ComponentRef, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { UserItem } from "@/components/sidebar/user-item";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { Item } from "@/components/sidebar/item";
import { NoteList } from "@/components/sidebar/note-list";
import { TrashBox } from "@/components/sidebar/trash-box";
import { Navbar } from "@/components/main/navbar";
import { createNote } from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {FavoriteNotes} from "@/components/sidebar/favorite-notes";
import {useSidebar} from "@/hooks/use-sidebar";
import {NavItem} from "@/components/sidebar/nav-item";

export function Navigation() {
  const settings = useSettings();
  const search = useSearch();
  const activeNoteId = useActiveNote((store)=> store.activeNoteId);
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ComponentRef<"aside">>(null);
  const navbarRef = useRef<ComponentRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  // const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    console.log("加载Navigation组件")
    if (isMobile) {
      collapseSidebar();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetSidebarWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapseSidebar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => { setIsResetting(false); }, 300);
    }
  };

  const onCreateNote = () => {
    const promise = createNote("Untitled").then((noteId) =>
      { setActiveNoteId(noteId); }
    );

    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create note.",
    });
  };

  return (
    <>
      <aside
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
        ref={sidebarRef}
      >
        <div>
          <div
            className={cn(
              `w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
        top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
              isMobile && "opacity-100"
            )}
            onClick={collapseSidebar}
            role="button"
          >
            <ChevronsLeft className="w-6 h-6" />
          </div>
          <div>
            <UserItem />
            <NavItem label="Search" icon={Search} hotkey="K" onClick={search.onOpen}/>
            <NavItem label="Settings" icon={Settings} onClick={settings.onOpen} />
            <NavItem onClick={onCreateNote} label="New page" icon={PlusCircle} />
          </div>
          <div className="mt-4">
            <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">Favorites</span>
            <FavoriteNotes />
          </div>
          <div className="mt-4">
            <span className="pl-3.5 min-h-[27px] text-xs py-1 pr-3 w-full flex items-center text-muted-foreground font-medium">Notes</span>
            <NoteList />
            <Item onClick={onCreateNote} icon={Plus} label="Add a page" />
          </div>
          <div className="mt-4">
            <Popover>
              <PopoverTrigger className="w-full mt-4">
                <NavItem label="Trash" icon={Trash} />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-72 " side={isMobile ? "bottom" : "right"}>
                <TrashBox />
              </PopoverContent>
            </Popover>
          </div>
          <div
            className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10
        right-0 top-0"
            onMouseDown={handleMouseDown}
            onClick={resetSidebarWidth}
          ></div>
        </div>
      </aside>
      <div
        className={cn(
          `absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]`,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
        ref={navbarRef}
      >
        {activeNoteId!=undefined ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebarWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                className="w-6 h-6 text-muted-foreground"
                onClick={resetSidebarWidth}
                role="button"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
