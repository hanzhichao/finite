"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import {archiveNote, copyNote, createNote} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {useSettings} from "@/hooks/use-settings";
import { useTranslation } from "react-i18next";

interface NoteItemActionsProps {
  id?: string;
  expanded?: boolean;
  onExpand?: () => void;
  updateAt?: string,
}

export const NoteItemActions = ({
  id,
  onExpand,
  expanded,
  updateAt,
}: NoteItemActionsProps) => {
  const activeNoteId  = useActiveNote((store)=>store.activeNoteId)
  const setActiveNoteId  = useActiveNote((store)=>store.setActiveNoteId)
  const settings = useSettings()
  const { t } = useTranslation();

  // 归档笔记
  const onArchiveNote = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    const promise = archiveNote(id);
    toast.promise(promise, {
      loading: t("Moving to trash..."),
      success: t("Note moved to trash!"),
      error: t("Failed to archive note.")
    });
    if (id === activeNoteId){
      setActiveNoteId(undefined)
    }
  };

  const onCopyNote = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    
    void copyNote(id, "-Copy").then(
      newId=>{ setActiveNoteId(newId); }
    );
    // toast.promise(promise, {
    //   loading: "Copy note...",
    //   success: "Note copied!",
    //   error: "Failed to copy note."
    // });
  };

  // 创建下级笔记
  const onCreateSubNote = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    event.stopPropagation();
    const promise = createNote(settings.defaultTitle || "Untitled", id, settings.defaultIcon).then(
      (noteId) => {
        if (!expanded) {
          onExpand?.();
        }
        setActiveNoteId(noteId)
      }
    );
    toast.promise(promise, {
      loading: t("Creating a new note..."),
      success: t("New note created!"),
      error: t("Failed to create a new note."),
    });
  };


  return (
    <div className="ml-auto flex items-center gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => { e.stopPropagation(); }}>
          <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:hover:bg-neutral-600">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start" side="right" forceMount>
          <DropdownMenuItem onClick={onArchiveNote}>
            <Trash className="h-4 w-4 mr-2"/>
            {t("Delete")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyNote}>
            <Copy className="h-4 w-4 mr-2"/>
            {t("Duplicated")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="text-sm text-muted-foreground p-2">
            {t("updated at")}: {updateAt}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <div role="button" onClick={onCreateSubNote} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
        <Plus className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};
