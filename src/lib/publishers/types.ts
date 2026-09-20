export interface PublishPayload {
  caption: string
  mediaUrls?: string[]
  tiktokTitle?: string
  credentials: Record<string, string>
}

export interface PublishResult {
  platform: string
  success: boolean
  postId?: string
  error?: string
}
