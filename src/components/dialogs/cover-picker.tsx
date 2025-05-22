"use client"
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/ui/single-image-dropzone";
import {updateNoteCover} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {toast} from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area"


const COLOR_GRADIENTS = [
  "linear-gradient(to right, #ff9a9e, #fad0c4)",
  "linear-gradient(to right, #a1c4fd, #c2e9fb)",
  "linear-gradient(to right, #ffecd2, #fcb69f)",
  "linear-gradient(to right, #84fab0, #8fd3f4)",
  "linear-gradient(to right, #cfd9df, #e2ebf0)",
  "linear-gradient(to right, #a6c0fe, #f68084)",
  "linear-gradient(to right, #fccb90, #d57eeb)",
  "linear-gradient(to right, #e0c3fc, #8ec5fc)",
]


export function CoverPicker() {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const updateActiveNoteCover = useActiveNote((store) => store.updateActiveNoteCover);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onUploadCover =  (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      if (typeof activeNoteId !== "undefined") {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
          const result = reader.result;
          if (typeof result === 'string') {
            updateActiveNoteCover(result)
            const promise = updateNoteCover(activeNoteId, result);
            toast.promise(promise, {
              loading: "Upload cover...",
              success: "Cover uploaded!",
              error: "Failed to upload cover.",
            });
          } else if (result instanceof ArrayBuffer) {
            console.log('Result is ArrayBuffer, handle accordingly');
          } else {
            console.log('Result is null or undefined');
          }
        };
        reader.onerror = function (error) {
          console.log('Upload Error: ', error);
        }
      }
      onClose();
    }
  };

  const onSelectCover = (url: string )=> {
    updateActiveNoteCover(url)
    onClose();
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogTitle>
      </DialogTitle>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onUploadCover}
        />
        <ScrollArea className="h-60">
          <h3 className="text-sm font-medium mt-4 mb-2">Gradients</h3>
          <div className="grid grid-cols-2 gap-4">
            {COLOR_GRADIENTS.map((gradient, index) => (
              <div
                key={`gradient-${index}`}
                className="h-24 rounded-md overflow-hidden cursor-pointer hover:ring-1"
                style={{ background: gradient }}
                onClick={() =>
                { onSelectCover(
                  `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" style="background:${encodeURIComponent(gradient)}"></svg>`,
                ); }
                }
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
