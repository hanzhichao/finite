"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {createNote, getNotes} from "@/lib/notes";
import {useEffect, useState} from "react";
import {Note} from "@/lib/types";
import {useActiveNote} from "@/hooks/use-active-note";
import {Clock, GalleryThumbnails, LayoutList, Plus, PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useSettings} from "@/hooks/use-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  IconChevronDown,
  IconChevronLeft, IconChevronRight,
  IconChevronsLeft, IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus
} from "@tabler/icons-react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";

interface NoteSubNotesCardProps {
  data: Note[];
  onCreate: (event: React.MouseEvent<HTMLButtonElement>) => void;
}


export const NoteSubNotesCard = ({data, onCreate}: NoteSubNotesCardProps)=> {
  const setActiveNoteId = useActiveNote.getState().setActiveNoteId;
  const setSubNotesView = useActiveNote.getState().setSubNotesView;
  const updateActiveNoteIcon = useActiveNote.getState().updateActiveNoteIcon;
  const updateActiveNoteTitle = useActiveNote.getState().updateActiveNoteTitle;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 py-3">
        <div className="flex pl-1 gap-x-2 items-center text-muted-foreground">
          <GalleryThumbnails className="w-4 h-4"/>
          <span className="text-muted-foreground">Sub notes</span>
        </div>
        <div className="flex gap-x-2">
          <Button variant="outline" size="sm" onClick={onCreate}>
            <IconPlus />
            <span className="hidden lg:inline">Add sub note</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.map((note) => (
          <Card key={note.id} className="hover:bg-accent pt-0 cursor-pointer" onClick={() => {
            updateActiveNoteTitle(note.title)
            updateActiveNoteIcon(note.icon?? "")
            setActiveNoteId(note.id)
            setSubNotesView(false)
          }}>
            <CardHeader className="p-0">
              {!!note.cover &&
                  <Image src={note.cover} alt="NoteCover" className="h-full w-full p-0 rounded-t-xl" width={500}
                         height={300}/>
              }
            </CardHeader>
            <CardContent>
              <CardTitle>
                <div className="flex items-center gap-x-2">
                  {note.icon && (
                    <span>{note.icon}</span>)
                  }
                  {note.title}
                </div>
              </CardTitle>
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
    </div>
  )
}