"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { PostComposer } from "@/components/post-composer"
import { Button } from "@/components/ui/button"

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create New Post
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft your global description, customize platform-specific captions, and broadcast simultaneously.
            </p>
          </div>
        </div>

        <PostComposer />
      </main>
    </div>
  )
}
