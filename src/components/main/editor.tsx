"use client"

import "@blocknote/core/fonts/inter.css";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { codeBlock } from "@blocknote/code-block";
import {saveMarkdown} from "@/lib/notes";
import {toast} from "sonner";

interface EditorProps {
  noteId?: string,
  initialContent?: string;
  editable?: boolean;
  onChange: (value: string) => void;  // 笔记内容变动
}

const Editor = ({noteId, onChange,initialContent, editable}: EditorProps) => {
  const {resolvedTheme} = useTheme();

  const handelUpload = async (file: File) => {
    return ""; // TODO
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    codeBlock,
    animations: false,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    uploadFile: handelUpload
  });

  const exportMarkdown = async (noteId: string) => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    const filePath =  await saveMarkdown(noteId, markdown)
    console.log(`导出markdown成功：${filePath}`)
  }

  const onExportNote = () => {
    if (typeof noteId !== "undefined"){
      const promise = exportMarkdown(noteId)
      toast.promise(promise, {
        loading: "Export note as markdown...",
        success: "Note exported!",
        error: "Failed to export note."
      })
    }
  }


  return (
    <div>
      <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme == "dark" ? "dark": "light"}
      onChange={()=>{ onChange(JSON.stringify(editor.document, null, 2)); }}/>
    </div>
  )
}

export default Editor;