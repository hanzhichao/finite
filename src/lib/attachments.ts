import * as path from "@tauri-apps/api/path";
import { exists, mkdir, writeFile, remove } from "@tauri-apps/plugin-fs";

const ATTACHMENTS_DIR_NAME = "assets";

async function getAssetsDir() {
  const homeDir = await path.homeDir();
  return await path.join(homeDir, "Finite", ATTACHMENTS_DIR_NAME);
}

async function ensureDir(dir: string) {
  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir, { recursive: true });
  }
}

export async function saveNoteAttachment(noteId: string, file: File): Promise<string> {
  const assetsDir = await getAssetsDir();
  await ensureDir(assetsDir);

  const originalName = file.name || "attachment";
  const parts = originalName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";
  const baseName = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Date.now().toString();
  const fileName = ext ? `${baseName}.${ext}` : baseName;

  const targetPath = await path.join(assetsDir, fileName);
  const buffer = await file.arrayBuffer();
  await writeFile(targetPath, new Uint8Array(buffer));

  return targetPath;
}

export async function deleteNoteAttachment(filePath: string) {
  const assetsDir = await getAssetsDir();
  const normalized = await path.normalize(filePath);
  const dirNormalized = await path.normalize(assetsDir);

  if (!normalized.startsWith(dirNormalized)) {
    return;
  }

  await remove(normalized);
}

