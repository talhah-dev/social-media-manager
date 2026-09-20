"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FaXTwitter,
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaThreads,
} from "react-icons/fa6"
import { CheckCircle2, Link2, Unlink, BookOpen } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { ConnectModal, PlatformConfig } from "@/components/connect-modal"
import {
  getStoredConnections,
  saveStoredConnection,
  removeStoredConnection,
} from "@/lib/storage"

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "twitter",
    name: "X",
    icon: FaXTwitter,
    color: "text-zinc-100",
    bgColor: "bg-zinc-900 border border-zinc-700",
    description: "Post updates, threads, and short-form media to X followers.",
    fields: [
      { key: "apiKey", label: "API Key (Consumer Key)", placeholder: "Enter your Twitter API Key" },
      { key: "apiSecret", label: "API Secret Key (Consumer Secret)", placeholder: "Enter your Twitter API Secret", type: "password" },
      { key: "accessToken", label: "Access Token", placeholder: "Enter Access Token", type: "password" },
      { key: "accessTokenSecret", label: "Access Token Secret", placeholder: "Enter Access Token Secret", type: "password" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "text-zinc-100",
    bgColor: "bg-black border border-zinc-800",
    description: "Publish video clips, carousels, and captions to TikTok.",
    fields: [
      { key: "clientKey", label: "Client Key", placeholder: "Enter TikTok Client Key" },
      { key: "clientSecret", label: "Client Secret", placeholder: "Enter TikTok Client Secret", type: "password" },
      { key: "accessToken", label: "Access Token", placeholder: "Enter OAuth Access Token", type: "password" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-400",
    bgColor: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
    description: "Share visual stories, reels, and feeds to your Business account.",
    fields: [
      { key: "accountId", label: "Instagram Account ID", placeholder: "e.g. 17841400..." },
      { key: "accessToken", label: "Graph API Access Token", placeholder: "Enter Page/User Access Token", type: "password" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: FaFacebookF,
    color: "text-blue-400",
    bgColor: "bg-blue-600",
    description: "Broadcast updates, articles, and media to Facebook Page fans.",
    fields: [
      { key: "pageId", label: "Facebook Page ID", placeholder: "Enter your Facebook Page ID" },
      { key: "pageToken", label: "Page Access Token", placeholder: "Enter Page Access Token", type: "password" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedinIn,
    color: "text-sky-400",
    bgColor: "bg-[#0A66C2]",
    description: "Publish professional insights, company posts, and articles.",
    fields: [
      { key: "orgUrn", label: "Organization / Author URN", placeholder: "urn:li:organization:123456" },
      { key: "accessToken", label: "OAuth Access Token", placeholder: "Enter LinkedIn Access Token", type: "password" },
    ],
  },
  {
    id: "threads",
    name: "Threads",
    icon: FaThreads,
    color: "text-zinc-100",
    bgColor: "bg-zinc-950 border border-zinc-800",
    description: "Join public conversations and broadcast text threads with media.",
    fields: [
      { key: "userId", label: "Threads User ID", placeholder: "Enter Threads User ID" },
      { key: "accessToken", label: "Threads Access Token", placeholder: "Enter Threads Access Token", type: "password" },
    ],
  },
]

export function PlatformCards() {
  const [connections, setConnections] = useState<Record<string, Record<string, string>>>(() => getStoredConnections())
  const [activePlatform, setActivePlatform] = useState<PlatformConfig | null>(null)

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setConnections(res.data)
        }
      })
      .catch(() => {})
  }, [])

  const handleSaveCredentials = async (platformId: string, credentials: Record<string, string>) => {
    saveStoredConnection(platformId, credentials)
    setConnections((prev) => ({
      ...prev,
      [platformId]: credentials,
    }))

    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: platformId, credentials }),
    })
  }

  const handleDisconnect = async (platform: PlatformConfig) => {
    removeStoredConnection(platform.id)
    setConnections((prev) => {
      const next = { ...prev }
      delete next[platform.id]
      return next
    })

    await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: platform.id }),
    })

    toast.add({
      title: `${platform.name} Disconnected`,
      description: `Removed saved API credentials for ${platform.name}.`,
      type: "info",
    })
  }

  const connectedCount = Object.keys(connections).length

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Connected Channels
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your API keys to enable seamless single-click cross-posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/guides">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="size-3.5 text-primary" />
              <span>API Setup Guides</span>
            </Button>
          </Link>
          <Badge variant={connectedCount > 0 ? "default" : "outline"} className="px-3 py-1 text-xs">
            {connectedCount} of {PLATFORMS.length} Channels Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const isConnected = Boolean(connections[platform.id])
          const Icon = platform.icon

          return (
            <Card
              key={platform.id}
              className="relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-xl ${platform.bgColor} text-white shadow-sm`}>
                    <Icon className="size-5" />
                  </div>
                  {isConnected ? (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs font-medium">
                      <CheckCircle2 className="size-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Disconnected
                    </Badge>
                  )}
                </div>
                <CardTitle className="pt-3 text-lg font-semibold text-foreground">
                  {platform.name}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                  {platform.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                  {isConnected ? (
                    <div className="flex items-center justify-between font-mono text-[11px] text-foreground">
                      <span>Status: Keys configured</span>
                      <span className="text-emerald-500 font-semibold">● Ready</span>
                    </div>
                  ) : (
                    <span>No API credentials attached. Click connect to set up.</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                {isConnected ? (
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setActivePlatform(platform)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => handleDisconnect(platform)}
                    >
                      <Unlink className="size-3.5 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full gap-2 text-xs"
                    size="sm"
                    onClick={() => setActivePlatform(platform)}
                  >
                    <Link2 className="size-3.5" />
                    Connect {platform.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <ConnectModal
        platform={activePlatform}
        isOpen={Boolean(activePlatform)}
        onClose={() => setActivePlatform(null)}
        onSave={handleSaveCredentials}
        currentCredentials={activePlatform ? connections[activePlatform.id] : undefined}
      />
    </section>
  )
}
