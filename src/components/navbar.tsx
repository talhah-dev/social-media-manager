"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Share2, Plus, Sparkles, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

interface NavbarProps {
  onNewPost?: () => void
  onLogout?: () => void
}

export function Navbar({ onNewPost, onLogout }: NavbarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    if (onLogout) {
      onLogout()
    }
    try {
      await authClient.signOut()
      toast.add({
        title: "Logged Out",
        description: "You have been logged out successfully.",
        type: "info",
      })
      router.push("/login")
      router.refresh()
    } catch {
      setIsLoggingOut(false)
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Share2 className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-foreground">
              Social Media Manager
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" /> Multi-Platform Hub
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="text-xs">
              Recent Posts
            </Button>
          </Link>

          <Link href="/new-post">
            <Button
              onClick={onNewPost}
              className="flex items-center gap-2 shadow-sm"
            >
              <Plus className="size-4" />
              <span>New Post</span>
            </Button>
          </Link>

          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5"
          >
            {isLoggingOut ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
