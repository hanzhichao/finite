"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { archiveNote, createNote } from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import { useChangedNotes } from "@/hooks/use-changed-notes";
import { useEffect } from "react";

interface ItemProps {
  id?: string;
  noteIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
  updateAt?: string,
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  noteIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
  updateAt,
}: ItemProps) => {
  const activeNoteId  = useActiveNote((store)=>store.activeNoteId)
  const activeNoteIcon  = useActiveNote((store)=>store.activeNoteIcon)
  const activeNoteTitle  = useActiveNote((store)=>store.activeNoteTitle)
  const setActiveNoteId  = useActiveNote((store)=>store.setActiveNoteId)

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  // 归档笔记
  const onArchiveNote = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    const promise = archiveNote(id);
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });
    if (id === activeNoteId){
      setActiveNoteId(undefined)
    }
    
  };

  // 创建下级笔记
  const onCreateSubNote = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    event.stopPropagation();
    const promise = createNote("Untitled", id).then(
      (noteId) => {
        if (!expanded) {
          onExpand?.();
        }
        setActiveNoteId(noteId)
      }
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <a href="#" onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {/* id存在-是笔记-显示折叠图标 */}
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {/* 显示note图标或Item图标 */}
      {noteIcon ? (
        <div className="shrink-0 mr-2 text-[16px]">{noteIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      {/* 显示item文本--note标题 */}
      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center grap-1 rouned border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs mr-1">⌘</span>K
        </kbd>
      )}

      {/* id存在--是笔记-显示下拉菜单 */}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => { e.stopPropagation(); }}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchiveNote}>
                <Trash className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-sm text-muted-foreground p-2">
                updated at: {updateAt}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div role="button" onClick={onCreateSubNote} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </a>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `!{(level *12)+25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30px]" />
    </div>
  );
};
