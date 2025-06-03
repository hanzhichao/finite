import React, { useEffect, useRef } from "react";
import {Markmap} from 'markmap-view';
import {Transformer} from "markmap-lib";
import {useActiveNote} from "@/hooks/use-active-note";

export const NoteMarkmap = () => {
  const markdown = useActiveNote(store=>store.markdown)
  console.log(markdown)
  const ref = useRef<SVGSVGElement>(null);
  const transformer = new Transformer()

  useEffect(() => {
    const view = Markmap.create(ref.current);
    const {root} = transformer.transform(markdown);
    void view.setData(root)
      .then(() => {void view.fit();});
  }, []);

  return (
    <div className="h-full w-full">
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};