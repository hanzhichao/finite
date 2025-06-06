"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import {archiveNote, setNoteIsTemplate} from "@/lib/notes";
import {Download, MoreHorizontal, Trash, Fullscreen,LayoutTemplate} from "lucide-react";
import { toast } from "sonner";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {codeBlock} from "@blocknote/code-block";
import {saveFile} from "@/lib/utils"
import {useWideMode} from "@/hooks/use-wide-mode";
import { useTranslation } from "react-i18next";

enum ExportType {
  Markdown,
  HTML,
}

export function NavbarMenu (){
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const activeNoteTitle = useActiveNote((store)=> store.activeNoteTitle)
  const content = useActiveNote((store)=> store.content)
  const updateAt = useActiveNote((store)=> store.updateAt)
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const toggleWideMode  = useWideMode((store)=> store.toggleWideMode)
  const { t } = useTranslation();


  const editor: BlockNoteEditor = useCreateBlockNote({codeBlock,
    initialContent: content ? JSON.parse(content) as PartialBlock[] : undefined,
  });

  const onArchiveNote = () => {
    if (typeof activeNoteId !== "undefined"){
      const promise = archiveNote(activeNoteId)
      toast.promise(promise, {
        loading: t("Moving to trash..."),
        success: t("Notes moved to trash!"),
        error: t("Failed to archive note.")
      })
      setActiveNoteId(undefined)
    }
  }

  const exportNote = async (exportType: ExportType) => {
    let fileName: string
    let content: string
    if (exportType === ExportType.Markdown){
      fileName = `${activeNoteTitle}-${activeNoteId}.md`
      content = await editor.blocksToMarkdownLossy(editor.document);
    } else {
      fileName = `${activeNoteTitle}-${activeNoteId}.html`
      content = await editor.blocksToFullHTML(editor.document);
    }
    const filePath = await saveFile(fileName, content)
    console.log(`导出成功：${filePath}`)
    return filePath
  }

  const onExportNote = (exportType: ExportType) => {
    if (typeof activeNoteId !== "undefined"){
      const promise = exportNote(exportType)
      toast.promise(promise, {
        loading: "Export note as markdown...",
        success: (filePath) => `Note exported to ${filePath}`,
        error: (error) => `Failed to export note: ${error}`
      })
    }
  }

  const onSetTemplate = () => {
    if (typeof activeNoteId !== "undefined"){
      const promise = setNoteIsTemplate(activeNoteId)
      toast.promise(promise, {
        loading: t("Set template..."),
        success: t("Template is set"),
        error: t("Failed to set template")
      })
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
          <DropdownMenuItem onClick={()=>{toggleWideMode()}}>
            <Fullscreen className="h-4 w-4 mr-2"/>
            {t("Toggle Wide Mode")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{onSetTemplate()}}>
            <LayoutTemplate className="h-4 w-4 mr-2"/>
            {t("Set Template")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchiveNote}>
            <Trash className="h-4 w-4 mr-2"/>
            {t("Delete")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{onExportNote(ExportType.HTML)}}>
            <Download className="h-4 w-4 mr-2"/>
            {t("Export as HTML")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{onExportNote(ExportType.Markdown)}}>
            <Download className="h-4 w-4 mr-2"/>
            {t("Export as Markdown")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="text-xs text-muted-foreground p-2">
            {t("updated at")}: {updateAt}
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