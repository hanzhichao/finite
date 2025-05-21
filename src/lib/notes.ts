import Database from "@tauri-apps/plugin-sql";
import {Note} from "./types";
import {fileToBase64, generateUUID} from "./utils";
import * as path from "@tauri-apps/api/path";
import {exists, mkdir} from "@tauri-apps/plugin-fs";

async function createTable() {
  console.log("创建表notes")
  const homeDir = await path.homeDir();
  const dbFile = await path.join(homeDir, "Finite/notes.db");
  const db = await Database.load("sqlite:" + dbFile);
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "notes"
     (
         id          VARCHAR(255) PRIMARY KEY,
         parent      VARCHAR(255),
         title       VARCHAR(255) NOT NULL,
         icon        CHAR(1),
         cover       TEXT,
         content     TEXT,
         is_archived BOOLEAN  DEFAULT 0,
         is_favorite BOOLEAN  DEFAULT 0,
         create_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
         update_at   DATETIME DEFAULT CURRENT_TIMESTAMP
     );`);
  console.log("创建索引")
  await db.execute(`CREATE INDEX IF NOT EXISTS "by_parent" ON notes (parent)`);
  await db.close()
}

async function connDb(): Promise<Database> {
  const homeDir = await path.homeDir();
  const dbDir = await path.join(homeDir, "Finite");
  let shouldInitTable = false;
  const dbDirExists = await exists(dbDir);

  if (!dbDirExists) {
    await mkdir(dbDir);
  }
  const dbFile = await path.join(dbDir, "notes.db");
  const dbFileExists = await exists(dbFile);
  if (!dbFileExists) {
    shouldInitTable = true
  }
  if (shouldInitTable) {
    await createTable()
  }
  return await Database.load("sqlite:" + dbFile);
}

export async function getAllNotes() {
  const db = await connDb();
  console.log(`查询所有Note列表`);
  const result: Note[] = await db.select(
    "SELECT id,title,icon FROM notes WHERE is_archived = 0",
    []
  );
  return result;
}

export async function getNotes(parent?: string) {
  const db = await connDb();
  let result: Note[] = [];
  if (typeof parent !== "undefined") {
    console.log(`查询Note列表: parent=${parent}`);
    result = await db.select(
      "SELECT id,title,icon FROM notes WHERE is_archived = 0 AND parent = $1",
      [parent ? parent : null]
    );
  } else {
    console.log(`查询Note列表`);
    result = await db.select(
      "SELECT id,title,icon FROM notes WHERE is_archived = 0 AND parent IS NULL",
      []
    );
  }
  return result;
}

export async function getArchivedNotes() {
  console.log("查询已归档Note列表");
  const db = await connDb();
  const result: Note[] = await db.select(
    "SELECT id,title,icon FROM notes WHERE is_archived = $1",
    [1]
  );
  console.log(result);
  return result;
}

export async function getFavoriteNotes() {
  console.log("查询收藏Note列表");
  const db = await connDb();
  const result: Note[] = await db.select(
    "SELECT id,title,icon FROM notes WHERE is_favorite = $1",
    [1]
  );
  console.log(result);
  return result;
}

export async function getNote(id: string) {
  console.log(`查询Note: id=${id}`);
  const db = await connDb();
  const result: Note[] = await db.select("SELECT * FROM notes WHERE id = $1", [
    id,
  ]);
  return result[0];
}

export async function createNote(title: string, parent?: string) {
  if (typeof parent == "undefined") {
    console.log(`创建Note: title=${title}`);
  } else {
    console.log(`创建Note: title=${title}, parent=${parent}`);
  }
  const db = await connDb();
  const id = generateUUID();
  await db.execute(
    "INSERT INTO notes (id, title,parent) VALUES ($1,$2,$3)",
    [id, title, parent]
  );
  return id;
}

export async function archiveNote(id: string) {
  console.log(`归档Note: id=${id}`);
  const db = await connDb();
  await db.execute(
    "UPDATE notes SET is_archived = 1 WHERE id = $1 OR parent = $1",
    [id]
  );
  // await db.close()
}

export async function restoreNote(id: string) {
  console.log(`恢复Note: id=${id}`);
  const db = await connDb();
  await db.execute(
    "UPDATE notes SET is_archived = 0 WHERE id = $1 OR parent = $1",
    [id]
  );
}

export async function deleteNote(id: string) {
  console.log(`删除Note: id=${id}`);
  const db = await connDb();
  await db.execute("DELETE FROM notes WHERE id = $1 OR parent = $1", [id]);
  await db.close()
}

export async function updateNoteTitle(id: string, title: string) {
  console.log(`更新Note标题: id=${id}, title=${title}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET title = $1 WHERE id = $2", [
    title,
    id,
  ]);
}

export async function updateNoteCover(id: string, cover: string) {
  console.log(`更新Note封面: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET cover = $1 WHERE id = $2", [
    cover,
    id,
  ]);
  return cover;
}

export async function updateNoteIcon(id: string, icon: string) {
  console.log(`更新Note图标: id=${id}, icon=${icon}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET icon = $1 WHERE id = $2", [
    icon,
    id,
  ]);

}

export async function updateNoteFavorite(id: string, is_favorite: number) {
  console.log(`更新Note是否收藏: id=${id}, is_favorite=${is_favorite}"`);
  const db = await connDb();
  await db.execute("UPDATE notes SET is_favorite = $1 WHERE id = $2", [
    is_favorite,
    id,
  ]);
}

export async function updateNoteContent(id: string, content: string) {
  console.log(`更新Note内容: id=${id}`);
  const db = await connDb();
  await db.execute("UPDATE notes SET content = $1 WHERE id = $2", [
    content,
    id,
  ]);
}
