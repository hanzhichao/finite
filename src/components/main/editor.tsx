"use client"

import "@blocknote/core/fonts/inter.css";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
// import { codeBlock } from "@blocknote/code-block";
import { saveNoteAttachment } from "@/lib/attachments";
import { convertFileSrc } from "@tauri-apps/api/core";
import { createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";

interface EditorProps {
  noteId?: string,
  initialContent?: string;
  editable?: boolean;
  onChange: (content: string, markdown: string) => void;  // 笔记内容变动
}

const Editor = ({noteId, onChange,initialContent, editable}: EditorProps) => {
  const {resolvedTheme} = useTheme();

  const handelUpload = async (file: File) => {
    if (typeof noteId == "string") {
      const filePath = await saveNoteAttachment(noteId, file);
      return convertFileSrc(filePath);
    }
    return file.name
  }

  const codeBlock = createCodeBlockSpec(codeBlockOptions);
  const editor: BlockNoteEditor = useCreateBlockNote({
    codeBlock,
    animations: false,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    uploadFile: handelUpload
  });


  const onContentChange = (value: string) => {
    const markdown = editor.blocksToMarkdownLossy(editor.document);
    onChange(value, markdown);
  }

  return (
    <div>
      <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme == "dark" ? "dark": "light"}
      onChange={()=>{ onContentChange(JSON.stringify(editor.document, null)); }}
      />
    </div>
  )
}

export default Editor;