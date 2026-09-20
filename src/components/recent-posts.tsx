"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  Layers,
  Trash2,
  Plus,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  FaXTwitter,
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaThreads,
} from "react-icons/fa6"

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

const PLATFORM_META: Record<string, { name: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  twitter: { name: "X", icon: FaXTwitter, color: "bg-zinc-900 text-white" },
  tiktok: { name: "TikTok", icon: FaTiktok, color: "bg-black text-white" },
  instagram: { name: "Instagram", icon: FaInstagram, color: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white" },
  facebook: { name: "Facebook", icon: FaFacebookF, color: "bg-blue-600 text-white" },
  linkedin: { name: "LinkedIn", icon: FaLinkedinIn, color: "bg-[#0A66C2] text-white" },
  threads: { name: "Threads", icon: FaThreads, color: "bg-zinc-950 text-white" },
}

export interface PostItem {
  id: string
  globalCaption: string
  overrides?: Record<string, string> | null
  tiktokTitle?: string | null
  mediaUrls: string[]
  targetPlatforms: string[]
  status: string
  createdAt: string
}

export function RecentPosts() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setPosts(res.data)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleDelete = async (postId: string) => {
    setDeletingId(postId)
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      })
      const data = await res.json()
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId))
        toast.add({
          title: "Post Deleted",
          description: "Removed post record from database.",
          type: "info",
        })
      }
    } catch {
      toast.add({
        title: "Delete Failed",
        description: "Could not delete the post.",
        type: "error",
      })
    }
    setDeletingId(null)
  }

  const toggleExpand = (postId: string) => {
    setExpandedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <Spinner className="size-6 text-primary" />
        <p className="text-xs text-muted-foreground">Loading recent posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Layers className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">No posts uploaded yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Create and broadcast your first post to all your connected social media channels.
          </p>
        </div>
        <Link href="/new-post">
          <Button size="sm" className="gap-2 text-xs">
            <Plus className="size-4" />
            <span>Create New Post</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const hasOverrides = post.overrides && Object.keys(post.overrides).length > 0
        const isExpanded = Boolean(expandedPostIds[post.id])

        return (
          <Card key={post.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  <span className="font-medium text-foreground">{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">{post.status}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground mr-1">Published to:</span>
                  {post.targetPlatforms.map((platformId) => {
                    const meta = PLATFORM_META[platformId] || {
                      name: platformId,
                      icon: Sparkles,
                      color: "bg-zinc-800 text-white",
                    }
                    const Icon = meta.icon
                    return (
                      <Badge
                        key={platformId}
                        variant="secondary"
                        className={`text-[10px] gap-1 px-2 py-0.5 font-medium ${meta.color}`}
                      >
                        <Icon className="size-2.5" />
                        <span>{meta.name}</span>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {post.tiktokTitle && (
                <div className="rounded-md bg-muted/60 px-3 py-1.5 text-xs">
                  <span className="font-semibold text-foreground">TikTok Title: </span>
                  <span className="text-muted-foreground">{post.tiktokTitle}</span>
                </div>
              )}

              <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {post.globalCaption || "No global description"}
              </div>

              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {post.mediaUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-lg overflow-hidden border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

              {hasOverrides && isExpanded && post.overrides && (
                <div className="space-y-2 pt-2 border-t border-dashed">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Platform-Specific Custom Overrides:
                  </span>
                  <div className="grid gap-2">
                    {Object.entries(post.overrides).map(([plat, customText]) => {
                      if (!customText) return null
                      const meta = PLATFORM_META[plat] || { name: plat, icon: Sparkles, color: "" }
                      const Icon = meta.icon
                      return (
                        <div key={plat} className="rounded-lg bg-muted/30 p-2.5 border text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Icon className="size-3" />
                            <span>{meta.name}</span>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-wrap">{customText}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0 flex items-center justify-between border-t bg-muted/10 py-2.5 px-4 sm:px-6">
              {hasOverrides ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(post.id)}
                  className="gap-1 text-xs text-muted-foreground h-7 px-2"
                >
                  <span>{isExpanded ? "Hide Platform Overrides" : "View Platform Overrides"}</span>
                  {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </Button>
              ) : (
                <span className="text-[11px] text-muted-foreground">Used Global Description across all platforms</span>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.id)}
                disabled={deletingId === post.id}
                className="gap-1 text-xs text-destructive hover:bg-destructive/10 h-7 px-2"
              >
                {deletingId === post.id ? <Spinner className="size-3" /> : <Trash2 className="size-3.5" />}
                <span>Delete</span>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
