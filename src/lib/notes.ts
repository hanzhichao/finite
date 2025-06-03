import Database from "@tauri-apps/plugin-sql";
import {Note, Property, PropertyType} from "./types";
import {generateUUID, convertToISOString} from "./utils";
import * as path from "@tauri-apps/api/path";
import {BaseDirectory, exists, mkdir} from "@tauri-apps/plugin-fs";
import {addNoteProperty, copytNoteProperty, getProperties} from "@/lib/properties";

const DB_DIR_NAME = "Finite"
const DB_FILE_NAME = "notes.db"

async function createDbDir(dbDir: string) {
  const dbDirExists = await exists(DB_DIR_NAME, {
    baseDir: BaseDirectory.Home,
  });
  if (!dbDirExists) {
    console.log(`创建db目录：${dbDir}`)
    await mkdir(DB_DIR_NAME, {
      baseDir: BaseDirectory.Home,
    });
  }
}

async function createTable() {
  const homeDir = await path.homeDir();
  const dbFile = await path.join(homeDir, `${DB_DIR_NAME}/${DB_FILE_NAME}`);
  const db = await Database.load("sqlite:" + dbFile);
  console.log("db创建表: notes")
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "notes"
     (
         id          VARCHAR(64) PRIMARY KEY,
         parent      VARCHAR(64),
         title       VARCHAR(255) NOT NULL,
         icon        CHAR(1),
         tags        VARCHAR(255),
         cover       TEXT,
         content     TEXT,
         markdown    TEXT,
         is_archived BOOLEAN  DEFAULT false,
         is_favorite BOOLEAN  DEFAULT false,
         is_locked   BOOLEAN  DEFAULT false,
         is_template BOOLEAN  DEFAULT false,
         create_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
         update_at   DATETIME DEFAULT CURRENT_TIMESTAMP
     );`);
  console.log("db创建索引: notes.parent")
  await db.execute(`CREATE INDEX IF NOT EXISTS "by_parent" ON notes (parent)`);

  console.log("db创建表: properties")
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "properties"
     (
         id   VARCHAR(64) PRIMARY KEY,
         key  VARCHAR(255) NOT NULL,
         type SMALLINT DEFAULT 0
     );`);

  console.log("db创建表: options")
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "options"
     (
         property_id VARCHAR(64),
         label       VARCHAR(255) NOT NULL,
         value       VARCHAR(255) NOT NULL,
         bg_color    VARCHAR(32),
         FOREIGN KEY (property_id) REFERENCES properties (id)
     );`);

  console.log("db创建表: notes_properties")
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "notes_properties"
     (
         property_id VARCHAR(64),
         note_id     VARCHAR(64),
         value       VARCHAR(255),
         is_visible  BOOLEAN DEFAULT true,
         FOREIGN KEY (property_id) REFERENCES properties (id),
         FOREIGN KEY (note_id) REFERENCES notes (id)
     );`);

  await db.close()
}

export async function connDb(): Promise<Database> {
  const homeDir = await path.homeDir();
  const dbDir = await path.join(homeDir, DB_DIR_NAME);
  await createDbDir(dbDir)
  let shouldInitTable = false;
  const dbFile = await path.join(dbDir, DB_FILE_NAME);
  const dbFileExists = await exists(dbFile);
  if (!dbFileExists) {
    shouldInitTable = true
  }
  if (shouldInitTable) {
    await createTable()
  }
  return await Database.load("sqlite:" + dbFile);
}

export async function getRecentUpdatedNotes(limit?: number) {
  const db = await connDb();
  let result: Note[];
  if (typeof limit !== "undefined") {
    console.log(`db查询最近更新Note列表: limit=${limit}`);
    result = await db.select("SELECT id,title,icon,update_at,tags,cover FROM notes WHERE is_archived = 0 AND is_template = 0 ORDER BY update_at DESC LIMIT $1;", [limit]);
  } else {
    console.log(`db查询最近更新Note列表`);
    result = await db.select("SELECT id,title,icon,update_at,tags,cover FROM notes WHERE is_archived = 0 AND is_template = 0 ORDER BY update_at DESC;");
  }
  return result;
}

export async function searchNotes(keyword: string, limit?: number) {
  const db = await connDb();
  let result: Note[];
  if (typeof limit !== "undefined") {
    console.log(`db查询笔记：keyword=${keyword}, limit=${limit}`);
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE title LIKE $1 ORDER BY update_at DESC LIMIT $2;", [`%${keyword}%`, limit]);
  } else {
    console.log(`db查询笔记：keyword=${keyword}`);
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE title LIKE $1 ORDER BY update_at DESC;", [`%${keyword}%`]);
  }
  return result;
}

export async function getNotes(parent?: string) {
  const db = await connDb();
  let result: Note[] = [];
  if (typeof parent !== "undefined") {
    console.log(`db查询Note列表: parent=${parent}`);
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE is_archived = 0 AND is_template = 0 AND parent = $1 ORDER BY create_at", [parent]);
  } else {
    console.log(`db查询Note列表`);
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE is_archived = 0 AND is_template = 0 AND parent IS NULL ORDER BY create_at;");
  }
  return result;
}

export async function getArchivedNotes(limit?: number) {
  const db = await connDb();
  let result: Note[] = [];
  if (typeof limit !== "undefined") {
    console.log(`db查询已归档Note列表: limit=${limit}`);
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_archived = 1 ORDER BY update_at DESC LIMIT $1;", [limit]);
  } else {
    console.log(`db查询已归档Note列表`);
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_archived = 1 ORDER BY update_at DESC;")
  }
  return result;
}

export async function getFavoriteNotes(limit?: number) {
  const db = await connDb();
  let result: Note[] = [];
  if (typeof limit !== "undefined") {
    console.log("db查询收藏Note列表: limit=${limit}");
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_favorite = 1 ORDER BY create_at DESC LIMIT $1;", [limit])
  } else {
    console.log("db查询收藏Note列表");
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_favorite = 1 ORDER BY create_at DESC;")
  }
  return result;
}


export async function getTemplates(limit?: number) {
  const db = await connDb();
  let result: Note[] = [];
  if (typeof limit !== "undefined") {
    console.log("db查询模板列表: limit=${limit}");
    result = await db.select("SELECT id,title,icon FROM notes WHERE  is_template = 1 ORDER BY create_at DESC LIMIT $1;", [limit])
  } else {
    console.log("db查询收藏Note列表");
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_template = 1 ORDER BY create_at DESC;")
  }
  return result;
}

export async function getNote(id: string) {
  console.log(`db查询Note: id=${id}`);
  const db = await connDb();
  let note: Note = {id: "", title: "", icon: ""};
  const result = await db.select<Note[]>("SELECT * FROM notes WHERE id = $1", [id]);
  if (result.length > 0) {
    note = result[0];
  }
  const properties = await getProperties(note.id)
  const createAt: Property = {
    id: generateUUID(),
    key: "createAt",
    type: "DateTime",
    value: convertToISOString(note.create_at),
    note_id: note.id,
    is_readonly: true
  }
  // const updateAt: Property = {id: generateUUID(), key: "updateAt", type: "DateTime", value:  convertToISOString(note.update_at), note_id: note.id, is_readonly: true}
  note.properties = [createAt, ...properties]
  console.log("note.properties")
  console.log(note.properties)
  return note
}

export async function copyNote(originId: string, subfix?: string, newParent?: string) {
  const note = await getNote(originId)
  const db = await connDb();
  const id = generateUUID();
  subfix = subfix ?? ""
  const parent = newParent ?? note.parent
  await db.execute("INSERT INTO notes (id,parent,title,icon,cover,content,is_archived,is_favorite,is_locked,markdown) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
    [id, parent, note.title + subfix, note.icon, note.cover, note.content, note.is_archived, note.is_archived, note.is_locked,note.markdown])
  for (const item of note.properties ?? []) {
    if (item.key !== "createAt") {
      await copytNoteProperty(id, item.id, item.value)
    }
  }
  const subNotes = await getNotes(originId)
  for (const item of subNotes) {
    await copyNote(item.id, "", id)
  }
  return id;
}

export async function createNote(title: string, parent?: string, icon?: string) {
  const db = await connDb();
  const id = generateUUID();
  if (typeof parent == "undefined") {
    console.log(`db创建Note: title=${title}`);
    await db.execute("INSERT INTO notes (id, title,icon) VALUES ($1,$2,$3)", [id, title, icon ?? ""]);
  } else {
    console.log(`db创建Note: title=${title}, parent=${parent}`);
    await db.execute("INSERT INTO notes (id, title,parent,icon) VALUES ($1,$2,$3,$4)", [id, title, parent, icon ?? ""]
    );
  }
  // 为每个 Note创建默认 tags 属性
  await addNoteProperty(id, "tags", PropertyType.MULTI_SELECT, "")
  return id;
}

export async function archiveNote(id: string) {
  console.log(`db归档Note及子Note: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_archived = 1 WHERE id = $1 OR parent = $1", [id]
  );
}

export async function restoreNote(id: string) {
  console.log(`db恢复Note及子Note: id=${id}`);
  const db = await connDb();
  await db.execute(
    "UPDATE notes SET is_archived = 0 WHERE id = $1 OR parent = $1",
    [id]
  );
}

export async function deleteNote(id: string) {
  console.log(`db删除Note: id=${id}`);
  const db = await connDb();
  const result1 = await db.execute("DELETE FROM notes_properties WHERE note_id = $1", [id]);
  console.log(result1)
  const result2 = await db.execute("DELETE FROM notes WHERE id = $1 OR parent = $1", [id]);
  console.log(result2)
}

export async function updateNoteTitle(id: string, title: string) {
  console.log(`db更新Note标题: id=${id}, title=${title}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET title = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [title, id]);
}

export async function updateNoteCover(id: string, cover: string) {
  console.log(`db更新Note封面: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET cover = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [cover, id,]);
  return cover;
}

export async function updateNoteIcon(id: string, icon: string) {
  console.log(`db更新Note图标: id=${id}, icon=${icon}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET icon = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [icon, id]);
}

export async function updateNoteIsFavorite(id: string, is_favorite: number) {
  console.log(`db更新Note是否收藏: id=${id}, is_favorite=${is_favorite}"`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_favorite = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [is_favorite, id]);
}

export async function setNoteIsTemplate(id: string) {
  console.log(`db更新Note为模板: id=${id}"`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_template = true, update_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
}

export async function updateNoteIsLocked(id: string, is_locked: number) {
  console.log(`db更新Note是否锁定: id=${id}, is_locked=${is_locked}"`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_locked = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [is_locked, id]);
}

export async function updateNoteContent(id: string, content: string, markdown: string) {
  console.log(`db更新Note内容: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET content = $1, markdown= $2, update_at = CURRENT_TIMESTAMP WHERE id = $3", [content, markdown, id]);
}

export async function updateNoteTags(id: string, tags: string[]) {
  console.log(`db更新Note内容: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET tags = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [tags.join(","), id]);
}

export async function createNoteWithContent(title: string, content: string, parent?: string, id?: string, icon?: string) {
  const db = await connDb();
  if (typeof id === "undefined") {
    id = generateUUID();
  }
  if (typeof parent === "undefined") {
    console.log(`db导入Note: title=${title}`);
    await db.execute("INSERT INTO notes (id, title, content,icon) VALUES ($1,$2,$3,$4)", [id, title, content, icon ?? ""]);
  } else {
    console.log(`db导入Note: title=${title}`);
    await db.execute("INSERT INTO notes (id, title, parent, content,icon) VALUES ($1,$2,$3,$4,$5)", [id, title, parent, content, icon ?? ""]);
  }

  // 为每个 Note创建默认 tags 属性
  await addNoteProperty(id, "tags", PropertyType.MULTI_SELECT, "")

  return id;
}

export async function getNoteParent(id: string) {
  const db = await connDb();
  const result = await db.select<Note[]>("SELECT id,title,parent FROM notes WHERE id = $1", [id]);
  if (result.length > 0) {
    return result[0].parent;
  }
  return null;
}

export async function getNoteParents(id: string) {
  let parents: string[] = [];
  let parent = await getNoteParent(id);
  while (parent) {
    parents.push(parent);
    parent = await getNoteParent(parent);
  }
  return parents;
}

export async function updateNoteParent(id: string, parent: string | null) {
  console.log(`db更新Note parent: id=${id}, parent=${parent}`);
  if (parent === null) return;
  const parents = await getNoteParents(parent);
  if(parents.length > 0 && parents.includes(id)) return;
  
  const db = await connDb();
  if (parent) {
    await db.execute("UPDATE notes SET parent = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [parent, id]);
  } else {
    await db.execute("UPDATE notes SET parent = NULL, update_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
  }
}