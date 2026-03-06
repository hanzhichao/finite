"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveNote } from "@/hooks/use-active-note";
import {archiveNote, getNote, getTemplates, setNoteIsTemplate, updateNoteContent} from "@/lib/notes";
import {addNoteProperty} from "@/lib/properties";
import {
  Download,
  MoreHorizontal,
  Trash,
  Fullscreen,
  LayoutTemplate,
  PanelTopOpen,
  FileIcon,
  TableProperties
} from "lucide-react";
import { toast } from "sonner";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {saveFile} from "@/lib/utils"
import {useProperties} from "@/hooks/use-properties";
import {useWideMode} from "@/hooks/use-wide-mode";
import { useTranslation } from "react-i18next";
import { finiteBlockNoteSchema, parseInitialContent } from "@/lib/blocknote-schema";
import {Note, PropertyType} from "@/lib/types";
import React, {useEffect, useState} from "react";

enum ExportType {
  Markdown,
  HTML,
}

export function NavbarMenu (){
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const activeNoteTitle = useActiveNote((store)=> store.activeNoteTitle)
  const content = useActiveNote((store)=> store.content)
  const properties = useActiveNote((store)=> store.properties)
  const updateAt = useActiveNote((store)=> store.updateAt)
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const isSubNotesView = useActiveNote((store)=> store.isSubNotesView)
  const setSubNotesView = useActiveNote((store)=> store.setSubNotesView)
  const setMindView = useActiveNote((store)=> store.setMindView)
  const increaseContentChangeCount = useActiveNote((store)=> store.increaseContentChangeCount)
  const toggleWideMode  = useWideMode((store)=> store.toggleWideMode)
  const togglePropertiesVisibility  = useProperties((store)=> store.togglePropertiesVisibility)
  const { t } = useTranslation();

  const editor: BlockNoteEditor = useCreateBlockNote({
    schema: finiteBlockNoteSchema,
    initialContent: parseInitialContent(content),
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

  const onToggleSubNotes = () => {
    if (typeof activeNoteId !== "undefined") {
      setTimeout(() => {
        setSubNotesView(!isSubNotesView)
        if (!isSubNotesView) setMindView(false)
      }, 100)
    }
  }

  const [templates, setTemplates] = useState<Note[]>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await getTemplates();
      setTemplates(result);
    };
    void fetchData();
  }, [activeNoteId]);

  const insertTemplate = async (templateId: string) => {
    const template = await getNote(templateId)
    let newContent: string;
    if (typeof activeNoteId != "undefined" && template.content){
      if (!content) {
        newContent = template.content
      } else {
        newContent = template.content.slice(0,-1).concat(",", content ? content.slice(1): "")
      }
      const blocks = JSON.parse(newContent) as PartialBlock[];
      const markdown = await editor.blocksToMarkdownLossy(blocks)
      await updateNoteContent(activeNoteId, newContent, markdown)
    }
    const propertyKeys = properties.map(item=>item.key)
    for (const item of template.properties ?? []){
      if (typeof activeNoteId != "undefined" && !propertyKeys.includes(item.key)){
        await addNoteProperty(activeNoteId, item.key, item.type as PropertyType, item.value?? "")
      }
    }
  }

  const onInsertTemplate = (templateId: string) => {
    const promise = insertTemplate(templateId).then(r=>{ increaseContentChangeCount(); })
    toast.promise(promise, {
      loading: t("Insert template..."),
      success: t("Template inserted!"),
      error: t("Failed to insert template.")
    });
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
          <DropdownMenuItem onClick={()=>{togglePropertiesVisibility()}}>
            <TableProperties className="h-4 w-4 mr-2"/>
            {t("Show/Hide Properties")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {templates && templates.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">{t("Insert template")}</div>
              {templates.map((tmpl) => (
                <DropdownMenuItem key={tmpl.id} onClick={() => onInsertTemplate(tmpl.id)}>
                  <span className="mr-2">{tmpl.icon || "📄"}</span>
                  {tmpl.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
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