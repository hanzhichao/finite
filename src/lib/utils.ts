import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';
import * as path from "@tauri-apps/api/path";
import {create} from "@tauri-apps/plugin-fs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateUUID(): string {
  return uuidv4();
}

export async function saveFile(fileName: string, content: string){
  const homeDir = await path.homeDir();
  const filePath = await path.join(homeDir, `Finite/${fileName}`);
  const file = await create(filePath);
  await file.write(new TextEncoder().encode(content));
  await file.close();
  return filePath
}