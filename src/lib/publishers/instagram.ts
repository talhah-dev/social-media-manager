import { PublishPayload, PublishResult } from "./types"

export async function publishToInstagram({
  caption,
  mediaUrls = [],
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const accountId = credentials.accountId
  const accessToken = credentials.accessToken

  if (!accountId || !accessToken) {
    return {
      platform: "instagram",
      success: false,
      error: "Missing Instagram Account ID or Access Token",
    }
  }

  if (mediaUrls.length === 0) {
    return {
      platform: "instagram",
      success: false,
      error: "Instagram requires at least one image or video attachment",
    }
  }

  try {
    const createContainerRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: mediaUrls[0],
          caption,
          access_token: accessToken,
        }),
      }
    )

    const containerData = await createContainerRes.json()

    if (!createContainerRes.ok || containerData.error) {
      return {
        platform: "instagram",
        success: false,
        error: containerData.error?.message || "Could not create Instagram media container",
      }
    }

    const creationId = containerData.id

    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    )

    const publishData = await publishRes.json()

    if (!publishRes.ok || publishData.error) {
      return {
        platform: "instagram",
        success: false,
        error: publishData.error?.message || "Could not publish Instagram container",
      }
    }

    return {
      platform: "instagram",
      success: true,
      postId: publishData.id,
    }
  } catch (error) {
    return {
      platform: "instagram",
      success: false,
      error: String(error),
    }
  }
}
