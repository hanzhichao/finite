import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import {archiveNote, saveMarkdown} from "@/lib/notes";
import {Download, MoreHorizontal, Trash} from "lucide-react";
import { toast } from "sonner";
import {useEditor} from "@/hooks/use-editor";


export const NavbarMenu = () => {
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const updateAt = useActiveNote((store)=> store.updateAt)
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)

  const onArchiveNote = () => {
    if (typeof activeNoteId !== "undefined"){
      const promise = archiveNote(activeNoteId)
      toast.promise(promise, {
        loading: "Moving to trash...",
        success: "Notes moved to trash!",
        error: "Failed to archive note."
      })
      setActiveNoteId(undefined)
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="cursor-pointer" >
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
          <DropdownMenuItem onClick={onArchiveNote}>
            <Trash className="h-4 w-4 mr-2"/>
            Delete
          </DropdownMenuItem>
          {/*<DropdownMenuItem onClick={()=>{}}>*/}
          {/*  <Download className="h-4 w-4 mr-2"/>*/}
          {/*  Export*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuSeparator />
          <div className="text-xs text-muted-foreground p-2">
            updated at: {updateAt}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

NavbarMenu.Skeleton = function MenuSkeleton () {
  return (
    <Skeleton className="h-10 w-10" />
  )
}