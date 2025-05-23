"use client"

import "@blocknote/core/fonts/inter.css";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { codeBlock } from "@blocknote/code-block";
import {useEditor} from "@/hooks/use-editor";

interface EditorProps {
  noteId?: string,
  initialContent?: string;
  editable?: boolean;
  onChange: (value: string) => void;  // 笔记内容变动
}

const Editor = ({noteId, onChange,initialContent, editable}: EditorProps) => {
  const {resolvedTheme} = useTheme();
  const setEditor = useEditor((store)=>store.setEditor)

  const handelUpload = async (file: File) => {
    return ""; // TODO
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    codeBlock,
    animations: false,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    uploadFile: handelUpload
  });

  setEditor(editor)

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