"use client"

import {useState, useCallback} from "react"
import {useDropzone} from "react-dropzone"
import {Upload, X, FileIcon, CheckCircle, AlertCircle} from "lucide-react"
import {Progress} from "@/components/ui/progress"
import {ScrollArea} from "@/components/ui/scroll-area";

type FileStatus = "idle" | "uploading" | "success" | "error"

export interface FileWithStatus {
  file: File
  id: string
  progress: number
  status: FileStatus
}

interface FileUploaderProps {
  uploadFile: (file: File) => Promise<string>;
  callback?: (results: FileWithStatus[]) => void;
}

export function FileUploader({uploadFile, callback}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      progress: 0,
      status: "idle" as FileStatus,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Start uploading each file
    newFiles.forEach((file) => {
        void handleUpload(file)
      }
    )
    if (typeof callback !== "undefined"){
      callback(files)
    }
  }, [])



  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    maxSize: 10485760, // 10MB
    multiple: true,
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleUpload = async (fileWithStatus: FileWithStatus) => {
    try {
      // Update status to uploading
      setFiles((prev) => prev.map((f) => (f.id === fileWithStatus.id ? {...f, status: "uploading"} : f)))

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileWithStatus.id && f.progress < 90 ? {...f, progress: f.progress + 10} : f)),
        )
      }, 300)

      // Upload the file
      const result = await uploadFile(fileWithStatus.file)
      clearInterval(progressInterval)

      // Update with success
      setFiles((prev) =>
        prev.map((f) => (f.id === fileWithStatus.id ? {...f, status: "success", progress: 100, url: result} : f)),
      )
    } catch (error) {
      // Update with error
      setFiles((prev) => prev.map((f) => (f.id === fileWithStatus.id ? {...f, status: "error", progress: 0} : f)))
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground"/>
          <h3 className="text-lg font-medium mt-2">
            {isDragActive ? "Drop the files here" : "Drag & drop files here"}
          </h3>
          <p className="text-sm text-muted-foreground">or click to browse files (max 10MB)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Imported Files</h3>
          <ScrollArea className="h-60">
            <div className="space-y-3">
              {files.map((fileWithStatus) => (
                <div key={fileWithStatus.id} className="flex items-center gap-4 p-3 border rounded-md">
                  <div className="flex-shrink-0">
                    <FileIcon className="h-5 w-5 text-muted-foreground"/>
                  </div>
                  <div className="flex-1 min-w-0 max-w-[365]">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium truncate">{fileWithStatus.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(fileWithStatus.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <div className="mt-1">
                      <Progress value={fileWithStatus.progress} className="h-1"/>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {fileWithStatus.status === "uploading" && (
                      <p className="text-xs text-muted-foreground">{fileWithStatus.progress}%</p>
                    )}
                    {fileWithStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-500"/>}
                    {fileWithStatus.status === "error" && <AlertCircle className="h-4 w-4 text-red-500"/>}
                  </div>
                  {/*<Button variant="ghost" size="icon" onClick={() => {*/}
                  {/*  removeFile(fileWithStatus.id);*/}
                  {/*}} className="h-4 w-4">*/}
                  {/*  <X className="h-4 w-4"/>*/}
                  {/*  <span className="sr-only">Remove file</span>*/}
                  {/*</Button>*/}
                </div>
              ))}
            </div>
          </ScrollArea>

        </div>
      )}
    </div>
  )
}
