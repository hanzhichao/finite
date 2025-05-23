"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {useImport} from "@/hooks/use-import";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import {createNoteWithContent} from "@/lib/notes";
import {toast} from "sonner";
import * as path from "path";
import {FileWithStatus, FileUploader} from "@/components/common/file-uploader";
import {readFile} from "@/lib/utils";
import {useActiveNote} from "@/hooks/use-active-note";
import {generateUUID} from "@/lib/utils";

export const ImportDialog = () => {
  const importDialog = useImport();
  const editor: BlockNoteEditor = useCreateBlockNote();
  const setActiveNoteId = useActiveNote((store)=>(store.setActiveNoteId))
  const noteIds:string[] = []

  const uploadFileCallback = (results: FileWithStatus[]) => {
    setTimeout(()=>{
      setActiveNoteId(noteIds[noteIds.length-1])
      importDialog.onClose()
    }, 3000)
  }

  const uploadFile = async (file?: File) => {
    console.log(`uploadFile: ${file?.name}`)
    if (file) {
      const id = generateUUID();
      noteIds.push(id)
      const title = path.basename(file.name, path.extname(file.name));
      console.log(`title: ${title}`)
      const fileBody = await readFile(file);
      const blocks = await editor.tryParseMarkdownToBlocks(fileBody);
      const content = JSON.stringify(blocks, null, 2)
      const promise = createNoteWithContent(title, content, id)
      toast.promise(promise, {
        loading: "Importing note...",
        success: `Note imported: ${title}!`,
        error: "Failed to import note.",
      });
      return id
    }
    return ""
  }

  return (
    <Dialog open={importDialog.isOpen} onOpenChange={importDialog.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="txt-lg font-medium">
            Import Markdown file
          </DialogTitle>
        </DialogHeader>
        <FileUploader uploadFile={uploadFile} callback={uploadFileCallback}/>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog