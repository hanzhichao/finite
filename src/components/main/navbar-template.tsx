"use client"

import {LayoutTemplate, FileIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useActiveNote} from "@/hooks/use-active-note";
import {getNote, getTemplates, updateNoteContent} from "@/lib/notes";
import {addNoteProperty} from "@/lib/properties";
import {Note, PropertyType} from "@/lib/types";
import React, {useEffect, useState} from "react";
import {NoteItem} from "@/components/sidebar/note-item";
import {toast} from "sonner";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import { useTranslation } from "react-i18next";

export const NavbarTemplate = () => {
  const properties = useActiveNote((store)=>store.properties)
  const activeNoteId = useActiveNote((store)=>store.activeNoteId)
  const increaseContentChangeCount = useActiveNote((store)=>store.increaseContentChangeCount)
  const content = useActiveNote((store)=>store.content)
  const editor: BlockNoteEditor = useCreateBlockNote();
  const { t } = useTranslation();

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
      await updateNoteContent(activeNoteId, newContent, markdown)  // TODO
    }
    const propertyKeys = properties.map(item=>item.key)
    for (const item of template.properties ?? []){
      if (typeof activeNoteId != "undefined" && !propertyKeys.includes(item.key)){
        await addNoteProperty(activeNoteId, item.key, item.type as PropertyType, item.value?? "")
      }
    }
  }

  const [templates, setTemplates] = useState<Note[]>();

  useEffect(() => {
    console.log("加载NavTemplates组件");
    const fetchData = async () => {
      const result = await getTemplates();
      setTemplates(result);
    };
    void fetchData();
  }, [activeNoteId]);


  const onInsertTemplate = (templateId: string) => {
    const promise =  insertTemplate(templateId).then(r=>{ increaseContentChangeCount(); })
    toast.promise(promise, {
      loading: t("Insert template..."),
      success: t("Template inserted!"),
      error: t("Failed to insert template.")
    });
  }

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="cursor-pointer hover:bg-accent px-2.5 py-2 rounded-md">
          <LayoutTemplate className="w-4 h-4"/>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-42 " side="bottom">
        <div className="p-3">
        <div className="pl-1 pb-1 mb-1 text-sm text-muted-foreground border-b-1">{t("Insert template")}</div>
          {templates?.map((note) => (
            <div key={note.id}>
              <NoteItem
                onClick={() => { onInsertTemplate(note.id); }}
                label={note.title}
                icon={FileIcon}
                noteIcon={note.icon}
                active={activeNoteId === note.id}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
