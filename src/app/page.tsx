"use client"

import { Navbar } from "@/components/navbar"
import { PlatformCards } from "@/components/platform-cards"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar onNewPost={() => {}} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        <PlatformCards />
      </main>
    </div>
  )
}
