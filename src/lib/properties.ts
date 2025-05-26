import {connDb} from "./notes";
import {Property} from "./types"

export async function getProperties(noteId: string) {
  const db = await connDb();
  console.log(`db查询Property列表: note_id=${noteId}`);
  const result: Property[] = await db.select("SELECT id,key,type,value FROM properties WHERE note_id = $1 ORDER BY id", [noteId]);
  return result;
}
