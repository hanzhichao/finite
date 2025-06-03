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
  const setActiveNote = useActiveNote(store=>store.setActiveNote)
  // const markdown = useActiveNote(store=>store.markdown)
  const ref = useRef<SVGSVGElement>(null);
  const transformer = new Transformer()
  const [note, setNote] = useState<Note>();
  const [markdown, setMarkdown] = useState("")

  useEffect(() => {
    console.log(`加载NoteMarkMap组件: noteId=${noteId}`);

    if (ref.current) {
      ref.current.innerHTML = "";
    }

    const fetchData = async () => {
      const curNote: Note = await getNote(noteId);

      const view = Markmap.create(ref.current);

      if (typeof curNote.markdown !== "undefined" && curNote.markdown !== null && curNote.markdown !== ""){
        console.log("markdown")
        console.log(curNote.markdown)
        const {root} = transformer.transform(curNote.markdown ?? "");
        void view.setData(root)
          .then(() => {void view.fit();});
      }
      setActiveNote(curNote);
    };

    void fetchData();

  }, [noteId]);

  return (
    <div className="h-full w-full">
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};