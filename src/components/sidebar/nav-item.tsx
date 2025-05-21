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

interface NavItemProps {
  label: string;
  icon: LucideIcon;
  hotkey?: string;
  onClick?: () => void;
}

export const NavItem = ({label, icon: Icon, hotkey, onClick}: NavItemProps) => {
  return (
    <a href="#" onClick={onClick}
      role="button"
      style={{ paddingLeft: "12px" }}
      className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium">
      {/* 显示note图标或Item图标 */}
      <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      {/* 显示item文本--note标题 */}
      <span className="truncate">{label}</span>

      {!!hotkey && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center grap-1 rouned border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs mr-1">⌘</span>{hotkey}
        </kbd>
      )}
    </a>
  );
};

NavItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
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
