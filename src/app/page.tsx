import Link from "next/link"
import { ArrowRight, History } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { PlatformCards } from "@/components/platform-cards"
import { RecentPosts } from "@/components/recent-posts"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        <PlatformCards />

        <section className="space-y-6 pt-4 border-t">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Recent Broadcasts
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                History of posts dispatched across your connected social platforms.
              </p>
            </div>

            <Link href="/posts">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <span>View All Posts</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <RecentPosts />
        </section>
      </main>
    </div>
  )
}
