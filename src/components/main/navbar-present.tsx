"use client"

import { Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveNote } from "@/hooks/use-active-note";
import { useShallow } from "zustand/react/shallow";

export const NavbarPresent = () => {
  const { activeNoteId, isPresentView, setPresentView, setMindView, setSubNotesView, setCalendarView } =
    useActiveNote(useShallow((store) => ({
      activeNoteId: store.activeNoteId,
      isPresentView: store.isPresentView,
      setPresentView: store.setPresentView,
      setMindView: store.setMindView,
      setSubNotesView: store.setSubNotesView,
      setCalendarView: store.setCalendarView,
    })));

  const onToggle = () => {
    if (!activeNoteId) return;
    setTimeout(() => {
      const next = !isPresentView;
      setPresentView(next);
      if (next) {
        setMindView(false);
        setSubNotesView(false);
        setCalendarView(false);
      }
    }, 50);
  };

  return (
    <Button size="sm" variant="ghost" className="cursor-pointer" onClick={onToggle}>
      <Presentation className={isPresentView ? "w-4 h-4 text-amber-400" : "w-4 h-4"} />
    </Button>
  );
};

