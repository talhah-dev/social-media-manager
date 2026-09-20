"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, ArrowRight, Key } from "lucide-react"
import {
  FaXTwitter,
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaThreads,
} from "react-icons/fa6"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GUIDE_CARDS = [
  {
    name: "X (Twitter)",
    href: "/x",
    icon: FaXTwitter,
    bgColor: "bg-zinc-900 border border-zinc-700",
    description: "Learn how to get Twitter Consumer API Keys, Secrets, and Bearer Tokens.",
    keys: ["API Key", "API Secret", "Access Token"],
  },
  {
    name: "TikTok",
    href: "/tiktok",
    icon: FaTiktok,
    bgColor: "bg-black border border-zinc-800",
    description: "Instructions for TikTok Content Posting API, Client Key, and Client Secret.",
    keys: ["Client Key", "Client Secret", "Access Token"],
  },
  {
    name: "Instagram",
    href: "/instagram",
    icon: FaInstagram,
    bgColor: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
    description: "Meta for Developers setup, Business Account ID, and Graph API Access Token.",
    keys: ["Instagram Account ID", "Access Token"],
  },
  {
    name: "Facebook Page",
    href: "/facebook",
    icon: FaFacebookF,
    bgColor: "bg-blue-600",
    description: "Retrieve your numeric Facebook Page ID and long-lived Page Access Token.",
    keys: ["Page ID", "Page Access Token"],
  },
  {
    name: "LinkedIn",
    href: "/linkedin",
    icon: FaLinkedinIn,
    bgColor: "bg-[#0A66C2]",
    description: "Create a LinkedIn App to generate Client ID, Secret, and Member/Org URN.",
    keys: ["Organization URN", "OAuth Token"],
  },
  {
    name: "Threads",
    href: "/threads",
    icon: FaThreads,
    bgColor: "bg-zinc-950 border border-zinc-800",
    description: "Generate Meta Threads User ID and content publish access tokens.",
    keys: ["Threads User ID", "Access Token"],
  },
]

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                API Setup & Connection Guides
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any platform below for step-by-step instructions on generating your personal API keys (BYOK).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {GUIDE_CARDS.map((guide) => {
            const Icon = guide.icon
            return (
              <Card
                key={guide.name}
                className="flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${guide.bgColor} text-white shadow-sm`}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <CardTitle className="pt-2 text-base font-semibold text-foreground">
                    {guide.name} Guide
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                    {guide.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Key className="size-3 text-primary" />
                    <span>Requires: {guide.keys.join(", ")}</span>
                  </div>

                  <Link href={guide.href} className="block w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                      <span>View Step-by-Step Guide</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
