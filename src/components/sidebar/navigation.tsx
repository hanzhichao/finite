"use client"

import React, { ComponentRef, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft, Maximize2,
  MenuIcon, Minus, X,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/main/navbar";
import { useActiveNote } from "@/hooks/use-active-note";
import {NavHeader} from "@/components/sidebar/nav-header";
import {NavMain} from "@/components/sidebar/nav-main";
import {NavFavorites} from "@/components/sidebar/nav-favorites";
import {NavNotes} from "@/components/sidebar/nav-notes";
import {NavSecondary} from "@/components/sidebar/nav-secondary";
import {createNote} from "@/lib/notes";
import {toast} from "sonner";
import {useSettings} from "@/hooks/use-settings";
import {NavTemplates} from "@/components/sidebar/nav-templates";
import {ScrollArea} from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ComponentRef<"aside">>(null);
  const navbarRef = useRef<ComponentRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const activeNoteId = useActiveNote((store)=> store.activeNoteId);
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId);
  const settings = useSettings()
  const { t } = useTranslation();


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

  useEffect(()=> {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        onCreateNote();
      }
    }
    document.addEventListener("keydown", down);
    return () => { document.removeEventListener("keydown", down); };
  }, []);

  const onCreateNote = () => {
    const promise = createNote(settings.defaultTitle||"Untitled", undefined, settings.defaultIcon).then((noteId) =>
      { setActiveNoteId(noteId); }
    );
    toast.promise(promise, {
      loading: t("Creating new note..."),
      success: t("New note created!"),
      error: t("Failed to create note."),
    });
  };

  return (
    <>
      <aside className={cn(
        `group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]`,
        isResetting && "transition-all ease-out duration-300",
        isMobile && "w-0"
      )} ref={sidebarRef}>
        <div data-tauri-drag-region className="group px-4 py-4 w-full flex items-center gap-x-2">
          <div className="w-3.5 h-3.5 flex items-center justify-center text-primary font-bold rounded-lg bg-red-500" id="titlebar-close">
            <X className="opacity-0 group-hover:opacity-100 transition w-3 h-3" role="button"/>
          </div>
          <div className="w-3.5 h-3.5 flex items-center justify-center text-primary font-bold rounded-lg bg-amber-300" id="titlebar-minimize">
            <Minus className="opacity-0 group-hover:opacity-100 transition w-3 h-3" role="button"/>
          </div>
          <div className="w-3.5 h-3.5 flex items-center justify-center text-primary font-bold rounded-lg bg-green-500" id="titlebar-maximize">
            <Maximize2 className="opacity-0 group-hover:opacity-100 transition w-2.5 h-2.5 rotate-90" role="button"/>
          </div>
        </div>
        {/*折叠按钮*/}
        <a href="#" className={cn( `w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
    top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,isMobile && "opacity-100")}
             onClick={collapseSidebar}  role="button">
          <ChevronsLeft className="w-6 h-6" />
        </a>

        <NavHeader />
        <NavMain onCreateNote={onCreateNote}/>
        <ScrollArea className="h-142">

        {settings.showFavorites && <NavFavorites />}
        <NavNotes onCreateNote={onCreateNote}/>
        <NavTemplates />
        </ScrollArea>
        <NavSecondary isMobile={isMobile} />

        {/*sidebar可拖拽边界*/}
        <div
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10
    right-0 top-0 rounded-l-2xl"
          onMouseDown={handleMouseDown}
          onClick={resetSidebarWidth}></div>
      </aside>
      <div className={cn(
          `absolute top-0 z-[99999] left-60 w-[calc(100%-240px)] rounded-tr-2xl`,
          isResetting && "rounded-tl-2xl transition-all ease-out duration-300",
          isMobile && "left-0 w-full"
        )}
        ref={navbarRef}
      >
        {activeNoteId!=undefined ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebarWidth} />
        ) : (
          <nav data-tauri-drag-region className="bg-transparent px-3 py-2 w-full">
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
