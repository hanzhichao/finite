"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import { updateNoteTitle } from "@/lib/notes";
import {ClickInput} from "@/components/common/click-input";

export const NavbarTitle = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const activeNoteTitle = useActiveNote((store) => store.activeNoteTitle);
  const activeNoteIcon = useActiveNote((store) => store.activeNoteIcon);
  const updateActiveNoteTitle = useActiveNote((store) => store.updateActiveNoteTitle);

  const onChangeTitle = (value: string) => {
    if (typeof activeNoteId !== "undefined"){
      void updateNoteTitle(activeNoteId, value)
        .then(r => {updateActiveNoteTitle(value)})
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!activeNoteIcon && <p>{activeNoteIcon}</p>}
      <ClickInput initialValue={activeNoteTitle} onValueChange={onChangeTitle}
                  inputClassName="h-7 px-2 focus-visible:ring-transparent"
                  textClassName="font-normal h-auto px-2 hover:bg-accent text-sm"/>
    </div>
  )
}

NavbarTitle.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rouded-md" />
  )
}