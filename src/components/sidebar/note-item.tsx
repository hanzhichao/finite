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
import {NoteItemActions} from "@/components/sidebar/note-item-actions";

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

export const NoteItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  noteIcon,
  level = 0,
  onExpand,
  expanded,
  updateAt,
}: ItemProps) => {
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    onExpand?.();
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
        <div className="shrink-0 mr-1.5 text-[14px]">{noteIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      {/* 显示item文本--note标题 */}
      <span className="truncate">{label}</span>


      {/* id存在--是笔记-显示下拉菜单 */}
      {!!id && (
        <NoteItemActions id={id} expanded={expanded} onExpand={onExpand} updateAt={updateAt}/>
      )}
    </a>
  );
};

NoteItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
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
