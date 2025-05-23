import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { Skeleton } from "@/components/ui/skeleton";
import { updateNoteCover } from "@/lib/notes";
import { useActiveNote } from "@/hooks/use-active-note";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const NoteCover = ({url, preview}: CoverProps) => {
  const activeNoteId = useActiveNote((store) => store.activeNoteId);
  const updateActiveNoteCover = useActiveNote((store) => store.updateActiveNoteCover);
  const coverImage = useCoverImage();

  const onRemoveCover = () => {
    if (typeof activeNoteId !== "undefined"){
      void updateNoteCover(activeNoteId, "").then(r => {updateActiveNoteCover("")});
    }
  }

  return (
    <div className={cn("relative w-full h-[35vh] group"
      , !url && "h-[12vh]"
      , url && "bg-muted")}>
      {!!url && (
        <Image src={url} fill alt="NoteCover" className="object-cover"/>
      )}
      {url && !preview &&  (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button onClick={() => { coverImage.onReplace(url) }} className="text-muted-foreground text-xs dark:text-neutral-600 dark:hover:dark:text-neutral-50" variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2"/>
            Change cover
          </Button>
          <Button onClick={onRemoveCover} className="text-muted-foreground text-xs dark:text-neutral-600 dark:hover:dark:text-neutral-50" variant="outline" size="sm">
            <X className="h-4 w-4 mr-2"/>
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

NoteCover.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className="w-full h-[12vh]"/>
  )
}