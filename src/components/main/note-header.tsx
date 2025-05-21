import { IconPicker } from "../dialogs/icon-picker";
import { Button } from "../ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import React, { ComponentRef, useRef, useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { updateNoteIcon, updateNoteTitle } from "@/lib/notes";
import { Note } from "@/lib/types";
import { useActiveNote } from "@/hooks/use-active-note";

interface NoteHeaderProps {
  initialData: Note;
  preview?: boolean;
}

export const NoteHeader = ({ initialData, preview }: NoteHeaderProps) => {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const activeNoteIcon = useActiveNote((store)=>store.activeNoteIcon)
  const activeNoteCover = useActiveNote((store)=>store.activeNoteCover)
  const activeNoteTitle = useActiveNote((store)=>store.activeNoteTitle)
  const updateActiveNoteTitle = useActiveNote((store)=>store.updateActiveNoteTitle)
  const updateActiveNoteIcon = useActiveNote((store)=>store.updateActiveNoteIcon)

  const [value, setValue] = useState(activeNoteTitle);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(activeNoteTitle);
      inputRef.current?.focus();
    }, 300);
  };

  const disableInput = () => { setIsEditing(false); };

  const onInput = (value: string) => {
    setValue(value);
    void updateNoteTitle(initialData.id,value || "Untitled").then(r => { updateActiveNoteTitle(value)});
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    void updateNoteIcon(initialData.id, icon).then(r => { updateActiveNoteIcon(icon); });
  };

  const onRemoveIcon = () => {
    void updateNoteIcon(initialData.id, "").then(r => { updateActiveNoteIcon(""); });
  };

  return (
    <header className="pl-[54px] group relative">
      {!!activeNoteIcon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-2">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {activeNoteIcon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!!activeNoteIcon && preview && (
        <p className="text-6xl pt-2">{activeNoteIcon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!activeNoteIcon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <Button
              className="text-muted-foreground text-xs "
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!activeNoteCover && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutoSize
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => { onInput(e.target.value); }}
        />
      ) : (
        <div className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          onClick={enableInput}>
          {activeNoteTitle}
        </div>
      )}
    </header>
  );
};
