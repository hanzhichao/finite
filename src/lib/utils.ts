import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateUUID(): string {
  return uuidv4();
}


export async function fileToBase64(file: File){
  const reader = new FileReader();
  let cover: string = "";
  reader.readAsDataURL(file);
  reader.onload = async function () {
    const result = reader.result;
    if (typeof result === 'string') {
      cover = result;
    } else if (result instanceof ArrayBuffer) {
      console.log('Result is ArrayBuffer, handle accordingly');
    } else {
      console.log('Result is null or undefined');
    }
  };
  reader.onerror = function (error) {
    console.log('Upload Error: ', error);
  }
  console.log(`cover: ${cover}`)
  return cover;
}