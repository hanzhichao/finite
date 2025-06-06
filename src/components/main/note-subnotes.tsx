"use client"
import * as React from "react"
import {createNote, getNotes} from "@/lib/notes";
import {useEffect, useState} from "react";
import {Note} from "@/lib/types";
import {useActiveNote} from "@/hooks/use-active-note";
import {toast} from "sonner";
import {useSettings} from "@/hooks/use-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next";

import {NoteSubNotesTable} from "@/components/main/note-subnotes-table";
import {NoteSubNotesCard} from "@/components/main/note-subnotes-card";

interface NoteSubNotesProps {
  noteId: string;
}

export const NoteSubNotes = ({noteId}: NoteSubNotesProps)=> {
  const [data, setData] = useState<Note[]>([]);
  const activeNoteId  = useActiveNote((store)=>store.activeNoteId)
  const settings = useSettings()
  const [count, setCount] = useState(0)
  const { t } = useTranslation();

  useEffect(() => {
    console.log(`加载NoteSubNotes组件: parent=${noteId}`);
    const fetchData = async () => {
      const result = await getNotes(noteId);
      setData(result)
    };
    void fetchData();
  }, [noteId, count]);

  const onCreateSubNote = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!activeNoteId) return;
    event.stopPropagation();
    const promise = createNote(settings.defaultTitle || "Untitled", activeNoteId, settings.defaultIcon).then(
      (noteId) => {
        setCount(count+1)
        // setActiveNoteId(noteId)
      }
    );
    toast.promise(promise, {
      loading: t("Creating a new note..."),
      success: t("New note created!"),
      error: t("Failed to create a new note."),
    });
  };

  return (
    // <main className="pt-20 pb-40 px-54">
    <main className="pt-20 pb-20 px-10">
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">{t("Table")}</TabsTrigger>
          <TabsTrigger value="card">{t("Card")}</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <NoteSubNotesTable data={data} onCreate={onCreateSubNote}/>
        </TabsContent>
        <TabsContent value="card">
          <NoteSubNotesCard data={data} onCreate={onCreateSubNote}/>
        </TabsContent>
      </Tabs>
    </main>
  )
}