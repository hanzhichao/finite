import { BlockNoteSchema, createCodeBlockSpec, PartialBlock } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";

export const finiteBlockNoteSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec(codeBlockOptions),
  },
});

/** Parse initialContent JSON, filtering out blocks with unknown types to prevent crashes. */
export function parseInitialContent(json: string | undefined): PartialBlock[] | undefined {
  if (!json) return undefined;
  try {
    const blocks = JSON.parse(json) as PartialBlock[];
    if (!Array.isArray(blocks)) return undefined;
    const knownTypes = new Set(Object.keys(finiteBlockNoteSchema.blockSpecs));
    function filterBlocks(items: PartialBlock[]): PartialBlock[] {
      return items
        .filter((b) => !b.type || knownTypes.has(b.type as string))
        .map((b) => {
          if (b.children && Array.isArray(b.children) && b.children.length > 0) {
            return { ...b, children: filterBlocks(b.children as PartialBlock[]) };
          }
          return b;
        });
    }
    return filterBlocks(blocks);
  } catch (e) {
    console.error("解析initialContent失败:", e);
    return undefined;
  }
}

