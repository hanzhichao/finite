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


export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 监听文件读取完成事件
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === "string") {
        resolve(event.target.result); // 成功读取后，将内容作为字符串返回
      } else {
        reject(new Error("Failed to read file content as string"));
      }
    };

    // 监听文件读取错误事件
    reader.onerror = (error: ProgressEvent<FileReader>) => {
      console.log(error)
    };

    // 开始以文本形式读取文件内容
    reader.readAsText(file);
  });
}