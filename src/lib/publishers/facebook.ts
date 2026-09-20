import { PublishPayload, PublishResult } from "./types"

export async function publishToFacebook({
  caption,
  mediaUrls = [],
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const pageId = credentials.pageId
  const pageToken = credentials.pageToken

  if (!pageId || !pageToken) {
    return {
      platform: "facebook",
      success: false,
      error: "Missing Facebook Page ID or Page Access Token",
    }
  }

  try {
    const hasMedia = mediaUrls.length > 0
    const endpoint = hasMedia
      ? `https://graph.facebook.com/v19.0/${pageId}/photos`
      : `https://graph.facebook.com/v19.0/${pageId}/feed`

    const bodyData: Record<string, string> = {
      access_token: pageToken,
    }

    if (hasMedia) {
      bodyData.url = mediaUrls[0]
      bodyData.caption = caption
    } else {
      bodyData.message = caption
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      return {
        platform: "facebook",
        success: false,
        error: data.error?.message || "Facebook Graph API rejected post",
      }
    }

    return {
      platform: "facebook",
      success: true,
      postId: data.id || data.post_id,
    }
  } catch (error) {
    return {
      platform: "facebook",
      success: false,
      error: String(error),
    }
  }
}
