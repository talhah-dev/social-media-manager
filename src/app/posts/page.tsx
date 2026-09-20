"use client"

import Link from "next/link"
import { ArrowLeft, Plus, History } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { RecentPosts } from "@/components/recent-posts"
import { Button } from "@/components/ui/button"

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Recent Published Posts
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse all previous broadcasts, upload dates, destination channels, and custom descriptions.
              </p>
            </div>
          </div>

          <Link href="/new-post">
            <Button size="sm" className="gap-2 text-xs shadow-sm">
              <Plus className="size-4" />
              <span>Create New Post</span>
            </Button>
          </Link>
        </div>

        <RecentPosts />
      </main>
    </div>
  )
}
