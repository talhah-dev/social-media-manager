"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

export interface PlatformConfig {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
  fields: { key: string; label: string; placeholder: string; type?: string }[]
}

interface ConnectModalProps {
  platform: PlatformConfig | null
  isOpen: boolean
  onClose: () => void
  onSave: (platformId: string, credentials: Record<string, string>) => void
  currentCredentials?: Record<string, string>
}

export function ConnectModal({
  platform,
  isOpen,
  onClose,
  onSave,
  currentCredentials = {},
}: ConnectModalProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  if (!platform) return null

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCredentials(currentCredentials)
    } else {
      onClose()
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await onSave(platform.id, credentials)
      setIsSaving(false)
      toast.add({
        title: `${platform.name} Connected`,
        description: `Successfully stored API credentials for ${platform.name} in database.`,
        type: "success",
      })
      onClose()
    } catch {
      setIsSaving(false)
      toast.add({
        title: "Connection Failed",
        description: `Could not save credentials for ${platform.name}.`,
        type: "error",
      })
    }
  }

  const Icon = platform.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className={`flex size-10 items-center justify-center rounded-xl ${platform.bgColor} text-white`}>
              <Icon className="size-5" />
            </div>
            <div>
              <DialogTitle>Connect {platform.name}</DialogTitle>
              <DialogDescription>
                Enter your {platform.name} API credentials (BYOK).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          {platform.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={credentials[field.key] || ""}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                required
              />
            </div>
          ))}

          <div className="pt-1">
            <Link
              href={platform.id === "twitter" ? "/x" : `/${platform.id}`}
              onClick={onClose}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <span>Need help getting your {platform.name} API keys? View guide</span>
            </Link>
          </div>

          <DialogFooter className="pt-2 gap-2 ">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Spinner /> : `Save & Connect`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
