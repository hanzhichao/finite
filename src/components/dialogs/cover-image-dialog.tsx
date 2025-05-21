"use client"
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/main/single-image-dropzone";
import {updateNoteCover} from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";
import {toast} from "sonner";

export function CoverImageModal() {
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

  const onChangeCover =  (file?: File) => {
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
          onChange={onChangeCover}
        />
      </DialogContent>
    </Dialog>
  );
}
