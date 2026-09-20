"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Sparkles,
  Send,
  Globe2,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { MediaUploader } from "@/components/media-uploader"
import { PLATFORMS } from "@/components/platform-cards"
import { getStoredConnections } from "@/lib/storage"

const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  threads: 500,
  instagram: 2200,
  linkedin: 3000,
  facebook: 63206,
  tiktok: 2200,
}

export function PostComposer() {
  const [globalCaption, setGlobalCaption] = useState("")
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [tiktokTitle, setTiktokTitle] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(() => {
    const connections = getStoredConnections()
    const activeIds = Object.keys(connections)
    return activeIds.length > 0 ? activeIds : PLATFORMS.map((p) => p.id)
  })
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const ids = Object.keys(res.data)
          if (ids.length > 0) setConnectedPlatforms(ids)
        }
      })
      .catch(() => {})
  }, [])

  const handleAiGenerate = () => {
    toast.add({
      title: "AI Generator Ready",
      description: "AI description generator will be connected with the LLM pipeline.",
      type: "info",
    })
  }

  const handleOverrideChange = (platformId: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [platformId]: value,
    }))
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!globalCaption.trim() && Object.values(overrides).every((v) => !v.trim())) {
      toast.add({
        title: "Caption Required",
        description: "Please enter a global description or platform-specific caption.",
        type: "error",
      })
      return
    }

    setIsPublishing(true)
    const activeList = PLATFORMS.filter((p) => connectedPlatforms.includes(p.id))

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalCaption,
          overrides,
          tiktokTitle,
          mediaUrls: images,
          targetPlatforms: activeList.map((p) => p.id),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setIsPublishing(false)
        setGlobalCaption("")
        setOverrides({})
        setTiktokTitle("")
        setImages([])

        const results: Array<{ platform: string; success: boolean; error?: string }> = data.dispatchResults || []
        const succeeded = results.filter((r) => r.success).map((r) => r.platform)
        const failed = results.filter((r) => !r.success)

        if (failed.length === 0) {
          toast.add({
            title: "Dispatched to All Channels!",
            description: `Successfully published live to ${succeeded.join(", ") || activeList.length + " channel(s)"}.`,
            type: "success",
          })
        } else if (succeeded.length > 0) {
          toast.add({
            title: "Partially Dispatched",
            description: `Published to ${succeeded.join(", ")}. Failed for ${failed.map((f) => f.platform).join(", ")}.`,
            type: "warning",
          })
        } else {
          toast.add({
            title: "Post Saved to Database",
            description: `Saved to history. API errors: ${failed.map((f) => `${f.platform}: ${f.error}`).join(" | ")}`,
            type: "info",
          })
        }
      } else {
        setIsPublishing(false)
        toast.add({
          title: "Publish Failed",
          description: data.error || "Could not save post to database.",
          type: "error",
        })
      }
    } catch {
      setIsPublishing(false)
      toast.add({
        title: "Publish Error",
        description: "An unexpected error occurred while saving the post.",
        type: "error",
      })
    }
  }

  const activePlatformConfigs = PLATFORMS.filter((p) => connectedPlatforms.includes(p.id))

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handlePublish} className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe2 className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Global Description
                </CardTitle>
                <CardDescription className="text-xs">
                  Default text inherited by all connected platforms unless overridden.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Textarea
              placeholder="What's on your mind? Write your main post caption here..."
              rows={4}
              value={globalCaption}
              onChange={(e) => setGlobalCaption(e.target.value)}
              className="resize-y"
            />

            <MediaUploader images={images} onChange={setImages} />

            <Button
              type="button"
              variant="outline"
              onClick={handleAiGenerate}
              className="w-full gap-2 text-sm text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10 shadow-sm"
            >
              <Sparkles className="size-4" />
              <span>Generate with AI</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">
                  <SlidersHorizontal className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Platform Overrides
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Customize separate descriptions for specific channels.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {activePlatformConfigs.length} Active Channels
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {activePlatformConfigs.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No social channels connected yet.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5 text-xs">
                    Connect Channels <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activePlatformConfigs.map((platform) => {
                  const Icon = platform.icon
                  const maxLimit = PLATFORM_LIMITS[platform.id] || 2200
                  const overrideText = overrides[platform.id] || ""
                  const charCount = overrideText ? overrideText.length : globalCaption.length
                  const isCustom = overrideText.trim().length > 0
                  const isExceeded = charCount > maxLimit

                  return (
                    <div
                      key={platform.id}
                      className="rounded-xl border bg-muted/20 p-4 space-y-3 transition-colors focus-within:border-primary/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex size-7 items-center justify-center rounded-lg ${platform.bgColor} text-white`}>
                            <Icon className="size-3.5" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {platform.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCustom ? (
                            <Badge variant="default" className="text-[10px] font-medium">
                              Custom Override
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                              Inheriting Global
                            </Badge>
                          )}
                          <span
                            className={`text-[11px] font-mono ${
                              isExceeded ? "text-destructive font-bold" : "text-muted-foreground"
                            }`}
                          >
                            {charCount}/{maxLimit}
                          </span>
                        </div>
                      </div>

                      {platform.id === "tiktok" && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            TikTok Video Heading / Title
                          </label>
                          <Input
                            placeholder="Enter TikTok title..."
                            value={tiktokTitle}
                            onChange={(e) => setTiktokTitle(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        {platform.id === "tiktok" && (
                          <label className="text-xs font-medium text-muted-foreground">
                            TikTok Caption / Description
                          </label>
                        )}
                        <Textarea
                          placeholder={`Leave empty to use Global Description for ${platform.name}...`}
                          rows={2}
                          value={overrideText}
                          onChange={(e) => handleOverrideChange(platform.id, e.target.value)}
                          className="resize-none text-xs"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={isPublishing}
          className="w-full gap-2 text-sm font-medium shadow-md"
        >
          {isPublishing ? (
            <Spinner className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
          <span>Publish to {activePlatformConfigs.length} Channel{activePlatformConfigs.length !== 1 ? "s" : ""}</span>
        </Button>
      </form>
    </div>
  )
}
