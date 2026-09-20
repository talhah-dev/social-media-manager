"use client"

import { useRef, useState } from "react"
import { ImagePlus, X, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

interface MediaUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function MediaUploader({ images, onChange }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const fileArray = Array.from(files)
    const uploadedUrls: string[] = []

    for (const file of fileArray) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const data = await res.json()
          if (data.success && data.url) {
            uploadedUrls.push(data.url)
          } else {
            toast.add({
              title: "Upload Failed",
              description: data.error || "Failed to upload file to Blob storage",
              type: "error",
            })
          }
        } catch {
          toast.add({
            title: "Upload Error",
            description: `Could not upload ${file.name}`,
            type: "error",
          })
        }
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls])
      toast.add({
        title: "Media Uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} file(s) to Vercel Blob.`,
        type: "success",
      })
    }

    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileImage className="size-4 text-primary" />
          <span>Post Media</span>
        </label>
        <span className="text-xs text-muted-foreground">
          {images.length} file{images.length !== 1 ? "s" : ""} selected
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click()
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-2">
          {isUploading ? <Spinner className="size-5" /> : <ImagePlus className="size-5" />}
        </div>
        <p className="text-xs font-medium text-foreground">
          {isUploading ? "Uploading to Vercel Blob..." : "Click to upload or drag & drop media"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          PNG, JPG, WebP, GIF or MP4
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((src, index) => (
            <div
              key={index}
              className="group relative aspect-video rounded-lg overflow-hidden border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Upload preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                className="absolute top-1.5 right-1.5 size-6 rounded-full opacity-90 group-hover:opacity-100 shadow-sm"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
