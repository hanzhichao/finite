"use client"

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Clock, FileIcon, PlusCircle} from "lucide-react";
import {createNote, getFavoriteNotes, getRecentUpdatedNotes} from "@/lib/notes";
import {toast} from "sonner";
import {useActiveNote} from "@/hooks/use-active-note";
import React, {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Note} from "@/lib/types";
import {Badge} from "@/components/ui/badge";

export const NoteEmpty = () => {
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId);
  const [notes, setNotes] = useState<Note[]>([])

  const onCreateNote = () => {
    const promise = createNote("Untitled").then((noteId) => {
        setActiveNoteId(noteId);
      }
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const onClick = (noteId: string) => {
    setActiveNoteId(noteId);
  };


  useEffect(() => {
    console.log("加载NoteEmpty页面");
    const fetchData = async () => {
      const result = await getRecentUpdatedNotes(8);
      setNotes(result);
    };
    void fetchData();
  }, []);

  return (
    <main className="h-full flex flex-col space-y-4 pt-40 px-10">
      <div className="flex items-center justify-between w-full">
        <div>
        </div>
        <Button variant="outline" onClick={onCreateNote}>
          <PlusCircle className="h-4 w-4 mr-2"/>
          Create a new note
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-gray-500"/>
        <span className="text-sm text-gray-500">Updated recently</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="hover:bg-accent pt-0" onClick={() => {
            onClick(note.id);
          }}>
            <CardHeader className="p-0">
              {!!note.cover &&
                  <Image src={note.cover} alt="NoteCover" className="h-full w-full p-0 rounded-t-xl" width={500}
                         height={300}/>
              }
            </CardHeader>
            <CardContent>
              <CardTitle>{note.title}</CardTitle>
              <div className="mt-2">
                {!!note.tags && (
                  note.tags.split(",").map((tag, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {tag}
                    </Badge>
                  ))
                )}</div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">updated at: {note.update_at}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

    </main>
  )
}