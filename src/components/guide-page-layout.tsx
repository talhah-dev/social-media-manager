"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, Key, CheckCircle2 } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface GuideStep {
  step: number
  title: string
  description: string
  actionUrl?: string
  actionText?: string
  details?: string[]
}

interface GuidePageLayoutProps {
  platformName: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  developerPortalUrl: string
  requiredKeys: string[]
  steps: GuideStep[]
}

export function GuidePageLayout({
  platformName,
  icon: Icon,
  iconBg,
  developerPortalUrl,
  requiredKeys,
  steps,
}: GuidePageLayoutProps) {
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
          <div className="flex items-center gap-3">
            <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} text-white shadow-sm`}>
              <Icon className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                How to Get {platformName} API Keys
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Step-by-step instructions to create developer credentials and connect your account.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="size-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Required Credentials</CardTitle>
              </div>
              <a
                href={developerPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <span>Open {platformName} Developer Portal</span>
                  <ExternalLink className="size-3" />
                </Button>
              </a>
            </div>
            <CardDescription className="text-xs pt-1">
              You will need to generate and copy the following keys into Social Media Manager:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {requiredKeys.map((keyName, idx) => (
                <Badge key={idx} variant="secondary" className="font-mono text-xs py-1 px-2.5">
                  {keyName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {steps.map((item) => (
            <Card key={item.step} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {item.title}
                    </CardTitle>
                  </div>

                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                        <span>{item.actionText || "Open Link"}</span>
                        <ExternalLink className="size-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {item.details && item.details.length > 0 && (
                  <div className="rounded-lg bg-muted/40 p-3 space-y-2 border">
                    {item.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-2 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="text-xs">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button className="text-xs">
              Connect {platformName} Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
