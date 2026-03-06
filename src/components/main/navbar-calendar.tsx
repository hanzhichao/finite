"use client"

import { CalendarDays } from "lucide-react";
import { useActiveNote } from "@/hooks/use-active-note";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";

export const NavbarCalendar = () => {
  const { isCalendarView, setCalendarView, setMindView, setSubNotesView } = useActiveNote(useShallow((store) => ({
    isCalendarView: store.isCalendarView,
    setCalendarView: store.setCalendarView,
    setMindView: store.setMindView,
    setSubNotesView: store.setSubNotesView,
  })));

  const toggleCalendarView = () => {
    setTimeout(() => {
      const next = !isCalendarView;
      setCalendarView(next);
      if (next) {
        setMindView(false);
        setSubNotesView(false);
      }
    }, 100);
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="cursor-pointer"
      onClick={toggleCalendarView}
    >
      <CalendarDays className={isCalendarView ? "w-4 h-4 text-amber-400" : "w-4 h-4"} />
    </Button>
  );
};

