import React, {useEffect, useRef, useState} from "react";
import {Markmap} from 'markmap-view';
import {Transformer} from "markmap-lib";
import {useActiveNote} from "@/hooks/use-active-note";
import {Note} from "@/lib/types";
import {getNote} from "@/lib/notes";

interface NoteMarkMapProps {
  noteId: string
}

export const NoteMarkMap = ({noteId}: NoteMarkMapProps) => {
  // const markdown = useActiveNote(store=>store.markdown)
  const setActiveNote = useActiveNote(store=>store.setActiveNote)
  const ref = useRef<SVGSVGElement>(null);
  const transformer = new Transformer()
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    console.log(`加载Page页面: noteId=${noteId}`);
    const fetchData = async () => {
      const curNote: Note = await getNote(noteId);
      if (typeof curNote === "undefined") {
        return;
      }
      setNote(curNote);
      setActiveNote(curNote);
    };
    void fetchData();
  }, [noteId]);

  useEffect(() => {
    const view = Markmap.create(ref.current);
    const {root} = transformer.transform(note?.markdown ?? "");
    void view.setData(root)
      .then(() => {void view.fit();});
  }, [noteId]);

  return (
    <div className="h-full w-full">
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};