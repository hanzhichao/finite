"use client"

import React, { ComponentRef, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { NavHeader } from "@/components/sidebar/nav-header";
import { createNote } from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {NavMain} from "@/components/sidebar/nav-main";
import {useSidebar} from "@/hooks/use-sidebar";

export function Sidebar() {
  const {isCollapsed, setIsCollapsed, isResetting, setIsResetting} = useSidebar();
  // const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ComponentRef<"aside">>(null);
  const navbarRef = useRef<ComponentRef<"div">>(null);
  // const [isResetting, setIsResetting] = useState(false);
  // const [isCollapsed, setIsCollapsed] = useState(isMobile);

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

  return (
    <aside className={cn(
        `group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]`,
        isResetting && "transition-all ease-in-out duration-300",
        isMobile && "w-0"
      )}
      ref={sidebarRef}
    >
      <div className={cn( `w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
    top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,isMobile && "opacity-100")}
        onClick={collapseSidebar}  role="button">
        <ChevronsLeft className="w-6 h-6" />
      </div>

      <NavHeader />
      <NavMain />

      <div
        className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10
    right-0 top-0"
        onMouseDown={handleMouseDown}
        onClick={resetSidebarWidth}></div>
    </aside>
  );
}
