import { PublishPayload, PublishResult } from "./types"

export async function publishToThreads({
  caption,
  mediaUrls = [],
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const userId = credentials.userId
  const accessToken = credentials.accessToken

  if (!userId || !accessToken) {
    return {
      platform: "threads",
      success: false,
      error: "Missing Threads User ID or Access Token",
    }
  }

  try {
    const hasMedia = mediaUrls.length > 0
    const createBody: Record<string, string> = {
      media_type: hasMedia ? "IMAGE" : "TEXT",
      text: caption,
      access_token: accessToken,
    }

    if (hasMedia) {
      createBody.image_url = mediaUrls[0]
    }

    const createRes = await fetch(
      `https://graph.threads.net/v1.0/${userId}/threads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody),
      }
    )

    const createData = await createRes.json()

    if (!createRes.ok || createData.error) {
      return {
        platform: "threads",
        success: false,
        error: createData.error?.message || "Threads container creation failed",
      }
    }

    const creationId = createData.id

    const publishRes = await fetch(
      `https://graph.threads.net/v1.0/${userId}/threads_publish`,
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
        platform: "threads",
        success: false,
        error: publishData.error?.message || "Threads publish failed",
      }
    }

    return {
      platform: "threads",
      success: true,
      postId: publishData.id,
    }
  } catch (error) {
    return {
      platform: "threads",
      success: false,
      error: String(error),
    }
  }
}
