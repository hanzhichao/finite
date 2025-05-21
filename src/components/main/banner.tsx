import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {ConfirmModal} from "@/components/dialogs/confirm-dialog";
import {deleteNote, restoreNote} from "@/lib/notes";
import {useActiveNote} from "@/hooks/use-active-note";

export const Banner = () => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId)
  const setActiveNoteId = useActiveNote((store) => store.setActiveNoteId)
  const restoreActiveNote = useActiveNote((store) => store.restoreActiveNote)

  // 彻底删除笔记
  const onRemoveNote = () => {
    if (typeof activeNoteId !== "undefined") {
      const promise = deleteNote(activeNoteId)

      toast.promise(promise, {
        loading: "Deleting note...",
        success: "Note deleted!",
        error: "Failed to delete note."
      })
      setActiveNoteId(undefined)
    }
  }

  // 恢复笔记
  const onRestoreNote = () => {
    if (typeof activeNoteId !== "undefined") {
      const promise = restoreNote(activeNoteId)
      toast.promise(promise, {
        loading: "Restoring note...",
        success: "Note resotred!",
        error: "Failed to restore note."
      })
      restoreActiveNote()
    }
  }

  return (
    <div className="w-full bg-rose-500 text-center tex-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>
        This page is in the Trash.
      </p>
      <Button size="sm" variant="outline" onClick={onRestoreNote}
              className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemoveNote}>
        <Button size="sm" variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}