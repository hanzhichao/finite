import {Lock, LockOpen} from "lucide-react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Button} from "@/components/ui/button";
import {updateNoteIsLocked} from "@/lib/notes";

export const NavbarLock = () => {
  const {activeNoteId, isLocked, lockNote, unLockNote} = useActiveNote((store) => ({
    activeNoteId: store.activeNoteId,
    isLocked: store.isLocked,
    lockNote: store.lockNote,
    unLockNote: store.unLockNote,
  }));

  return (
    <>
      {isLocked==1 ? (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          if (typeof activeNoteId !== "undefined") {
            unLockNote()
            void updateNoteIsLocked(activeNoteId, 0)
          }
        }}>
          <Lock className="w-4 h-4"/>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => {
          if (typeof activeNoteId !== "undefined") {
            lockNote()
            void updateNoteIsLocked(activeNoteId, 1)
          }
        }}>
          <LockOpen className="w-4 h-4"/>
        </Button>
      )
      }
    </>
  );
};
