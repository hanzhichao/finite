"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import { updateNoteTitle, getNoteAncestors } from "@/lib/notes";
import { ClickInput } from "@/components/common/click-input";
import { Note } from "@/lib/types";

export const NavbarTitle = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const activeNoteTitle = useActiveNote((store) => store.activeNoteTitle);
  const activeNoteIcon = useActiveNote((store) => store.activeNoteIcon);
  const updateActiveNoteTitle = useActiveNote((store) => store.updateActiveNoteTitle);
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);
  const goBack = useActiveNote((store) => store.goBack);
  const noteHistory = useActiveNote((store) => store.noteHistory);

  const [ancestors, setAncestors] = useState<Pick<Note, "id" | "title" | "icon">[]>([]);

  useEffect(() => {
    if (!activeNoteId) {
      setAncestors([]);
      return;
    }
    void getNoteAncestors(activeNoteId).then(setAncestors);
  }, [activeNoteId]);

  const onChangeTitle = (value: string) => {
    if (typeof activeNoteId !== "undefined") {
      void updateNoteTitle(activeNoteId, value)
        .then(() => { updateActiveNoteTitle(value) });
    }
  };

  const onNavigate = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  return (
    <div className="flex items-center gap-x-0.5 min-w-0 overflow-hidden">
      <button
        type="button"
        onClick={goBack}
        disabled={noteHistory.length === 0}
        className="h-6 w-6 shrink-0 inline-flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {ancestors.map((ancestor) => (
        <div key={ancestor.id} className="flex items-center gap-x-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(ancestor.id)}
            className="text-sm text-muted-foreground hover:text-foreground truncate max-w-[120px] px-1 rounded-sm hover:bg-accent cursor-pointer"
            title={`${ancestor.icon || ""} ${ancestor.title}`}
          >
            {ancestor.icon && <span className="mr-0.5">{ancestor.icon}</span>}
            {ancestor.title}
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
      ))}
      <div className="flex items-center gap-x-1 min-w-0">
        {!!activeNoteIcon && <p>{activeNoteIcon}</p>}
        <ClickInput initialValue={activeNoteTitle} onValueChange={onChangeTitle}
                    reloadOn={[activeNoteTitle]}
                    inputClassName="h-7 px-2 focus-visible:ring-transparent"
                    textClassName="font-normal h-auto px-2 hover:bg-accent text-sm"/>
      </div>
    </div>
  )
}

NavbarTitle.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rouded-md" />
  )
}
