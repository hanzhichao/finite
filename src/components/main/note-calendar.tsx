"use client"

import { useEffect, useState } from "react";
import { addMonths, format, startOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useActiveNote } from "@/hooks/use-active-note";
import { getNotesByDate, getOrCreateDailyNote, getNoteDatesInRange } from "@/lib/notes";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LayoutGrid, List, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const NoteCalendar = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [daysWithNotes, setDaysWithNotes] = useState<Date[]>([]);
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);
  const updateActiveNoteTitle = useActiveNote((store) => store.updateActiveNoteTitle);
  const updateActiveNoteIcon = useActiveNote((store) => store.updateActiveNoteIcon);
  const setCalendarView = useActiveNote((store) => store.setCalendarView);

  useEffect(() => {
    if (!selectedDate) return;
    const dateString = format(selectedDate, "yyyy-MM-dd");
    const fetchData = async () => {
      const result = await getNotesByDate(dateString);
      setNotes(result);
    };
    void fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const nextMonthStart = addMonths(monthStart, 1);
    const fetchDays = async () => {
      const start = format(monthStart, "yyyy-MM-dd 00:00:00");
      const end = format(nextMonthStart, "yyyy-MM-dd 00:00:00");
      const dates = await getNoteDatesInRange(start, end);
      const parsed = dates.map((d) => new Date(d));
      setDaysWithNotes(parsed);
    };
    void fetchDays();
  }, [currentMonth]);

  const openDailyNote = async () => {
    if (!selectedDate) return;
    const title = format(selectedDate, "yyyy-MM-dd");
    const icon = "📅";
    const noteId = await getOrCreateDailyNote(title, icon);
    updateActiveNoteTitle(title);
    updateActiveNoteIcon(icon);
    setActiveNoteId(noteId);
    setCalendarView(false);
  };

  const onOpenNote = (note: Note) => {
    updateActiveNoteTitle(note.title);
    updateActiveNoteIcon(note.icon ?? "");
    setActiveNoteId(note.id);
    setCalendarView(false);
  };

  return (
    <main className="flex flex-col md:flex-row gap-3 px-4 py-4 pb-16 bg-transparent">
      <div className="w-full md:w-auto md:min-w-[260px] md:max-w-[320px] md:shrink-0">
        <div className="inline-flex flex-col gap-3 w-full md:w-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={{ hasNote: daysWithNotes }}
            modifiersClassNames={{ hasNote: "calendar-has-note" }}
            className="rounded-md border w-full"
          />
          <Button className="w-full" variant="outline" onClick={openDailyNote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("Open daily note")}
          </Button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as "card" | "list"); }}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {selectedDate ? format(selectedDate, "yyyy-MM-dd") : t("Pick a date")}
              </span>
            </div>
            <TabsList>
              <TabsTrigger value="card">
                <LayoutGrid className="w-4 h-4" />
                {t("Card")}
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="w-4 h-4" />
                {t("List")}
              </TabsTrigger>
            </TabsList>
          </div>

          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("No notes on this day.")}
            </p>
          ) : (
            <>
              <TabsContent value="card">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {notes.map((note) => (
                    <Card
                      key={note.id}
                      className="hover:bg-accent cursor-pointer"
                      onClick={() => { onOpenNote(note); }}
                    >
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="flex items-center gap-2 text-sm leading-5">
                          <span className="shrink-0">{note.icon}</span>
                          <span className="truncate">{note.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-3 pb-2 pt-0">
                        <p className="text-xs text-muted-foreground">
                          {t("updated at")}: {note.update_at}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="list">
                <div className="rounded-md border divide-y overflow-hidden">
                  {notes.map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent transition flex items-center gap-3"
                      onClick={() => { onOpenNote(note); }}
                    >
                      <span className="shrink-0">{note.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{note.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("updated at")}: {note.update_at}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
};

