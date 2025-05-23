import Database from "@tauri-apps/plugin-sql";
import {Note} from "./types";
import {generateUUID} from "./utils";
import * as path from "@tauri-apps/api/path";
import {exists, mkdir, BaseDirectory} from "@tauri-apps/plugin-fs";

const DB_DIR_NAME = "Finite"
const DB_FILE_NAME = "notes.db"

async function createDbDir(dbDir: string ) {
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
  console.log("db创建表: notes")
  const homeDir = await path.homeDir();
  const dbFile = await path.join(homeDir, `${DB_DIR_NAME}/${DB_FILE_NAME}`);
  const db = await Database.load("sqlite:" + dbFile);
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
         is_archived BOOLEAN  DEFAULT 0,
         is_favorite BOOLEAN  DEFAULT 0,
         is_locked   BOOLEAN  DEFAULT 0,
         create_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
         update_at   DATETIME DEFAULT CURRENT_TIMESTAMP
     );`);
  console.log("db创建索引: notes.parent")
  await db.execute(`CREATE INDEX IF NOT EXISTS "by_parent" ON notes (parent)`);
  await db.close()
}

async function connDb(): Promise<Database> {
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
  if (typeof limit !== "undefined"){
    console.log(`db查询最近更新Note列表: limit=${limit}`);
    result = await db.select("SELECT id,title,icon,update_at,tags,cover FROM notes WHERE is_archived = 0 ORDER BY update_at DESC LIMIT $1;", [limit]);
  } else {
    console.log(`db查询最近更新Note列表`);
    result = await db.select("SELECT id,title,icon,update_at,tags,cover FROM notes WHERE is_archived = 0 ORDER BY update_at DESC;");
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
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE is_archived = 0 AND parent = $1 ORDER BY create_at", [parent]);
  } else {
    console.log(`db查询Note列表`);
    result = await db.select("SELECT id,title,icon,update_at FROM notes WHERE is_archived = 0 AND parent IS NULL ORDER BY create_at;");
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
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_favorite = 1 ORDER BY update_at DESC LIMIT $1;", [limit])
  } else {
    console.log("db查询收藏Note列表");
    result = await db.select("SELECT id,title,icon FROM notes WHERE is_favorite = 1 ORDER BY update_at DESC;")
  }
  return result;
}

export async function getNote(id: string) {
  console.log(`db查询Note: id=${id}`);
  const db = await connDb();
  let note: Note = {id: "", title: "", icon: ""};
  const result: Note[] = await db.select("SELECT * FROM notes WHERE id = $1", [id]);
  if (result.length > 0){
    note = result[0];
  }
  return note
}

export async function createNote(title: string, parent?: string) {
  const db = await connDb();
  const id = generateUUID();
  if (typeof parent == "undefined") {
    console.log(`db创建Note: title=${title}`);
    await db.execute("INSERT INTO notes (id, title) VALUES ($1,$2)", [id, title]);
  } else {
    console.log(`db创建Note: title=${title}, parent=${parent}`);
    await db.execute("INSERT INTO notes (id, title,parent) VALUES ($1,$2,$3)", [id, title, parent]
    );
  }
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
  await db.execute("DELETE FROM notes WHERE id = $1 OR parent = $1", [id]);
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

export async function updateNoteIsLocked(id: string, is_locked: number) {
  console.log(`db更新Note是否锁定: id=${id}, is_locked=${is_locked}"`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_locked = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [is_locked, id]);
}


export async function updateNoteContent(id: string, content: string) {
  console.log(`db更新Note内容: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET content = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [content, id]);
}


export async function updateNoteTags(id: string, tags: string[]) {
  console.log(`db更新Note内容: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET tags = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2", [tags.join(","), id]);
}

export async function createNoteWithContent(title: string, content: string, id?: string) {
  const db = await connDb();
  if (typeof id === "undefined"){
    id = generateUUID();
  }
  console.log(`db导入Note: title=${title}`);
  await db.execute("INSERT INTO notes (id, title, content) VALUES ($1,$2,$3)", [id, title, content]);
  return id;
}