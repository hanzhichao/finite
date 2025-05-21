"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import { updateNoteTitle } from "@/lib/notes";
import { Note } from "@/lib/types";
import { useRef, useState } from "react";

// interface TitleProps {initialData: Note}

export const Title = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const activeNoteTitle = useActiveNote((store) => store.activeNoteTitle);
  const activeNoteIcon = useActiveNote((store) => store.activeNoteIcon);
  const updateActiveNoteTitle = useActiveNote((store) => store.updateActiveNoteTitle);
  
  const [title, setTitle] = useState(activeNoteTitle || "Untitled")
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(activeNoteTitle);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      // inputRef.current?.setSelectionRange(0, 0)
    }, 0);
  };

  const disableInput = () => {setIsEditing(false);}
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (typeof activeNoteId !== "undefined"){
      void updateNoteTitle(activeNoteId, event.target.value || "Untitled")
        .then(r => {updateActiveNoteTitle(event.target.value || "Untitled")})
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!activeNoteIcon && <p>{activeNoteIcon}</p>}
      {isEditing ? (
        <Input ref={inputRef} 
        onClick={enableInput}
        onBlur={disableInput} 
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={title}
        className="h-7 px-2 focus-visible:ring-transparent" />
      ): (<Button onClick={enableInput} variant="ghost" size="sm" className="font-normal h-auto p-1">
        <span className="truncate">{activeNoteTitle}</span>
      </Button>)}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rouded-md" />
  )
}