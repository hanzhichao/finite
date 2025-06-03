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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {getNotes} from "@/lib/notes";
import {useEffect, useMemo, useState} from "react";
import {Note} from "@/lib/types";
import {useActiveNote} from "@/hooks/use-active-note";



interface NoteSubNotesProps {
  noteId: string;
}


export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => row.original.icon || ""
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const setActiveNoteId = useActiveNote.getState().setActiveNoteId;
      const setSubNotesView = useActiveNote.getState().setSubNotesView;
      return (
        <a
          href="#"
          className="text-primary hover:underline cursor-pointer"
          onClick={() => {
            setActiveNoteId(row.original.id)
            setSubNotesView(false)
          }}
        >
          {row.original.title}
        </a>
      );
    },
  },
  {
    accessorKey: "update_at",
    header: "Update At",
  },
]

export const NoteSubNotes = ({noteId}: NoteSubNotesProps)=> {
  const [data, setData] = useState<Note[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  useEffect(() => {
    console.log(`加载NoteSubNotes组件: parent=${noteId}`);
    const fetchData = async () => {
      const result = await getNotes(noteId);
      setData(result)
    };
    void fetchData();
  }, [noteId]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <main className="pt-20 pb-40 px-54">
      <h2 className="text-4xl font-medium mb-5">Sub notes</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}