import { PublishPayload, PublishResult } from "./types"

export async function publishToTikTok({
  caption,
  tiktokTitle,
  mediaUrls = [],
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const token = credentials.accessToken || credentials.clientKey

  if (!token) {
    return {
      platform: "tiktok",
      success: false,
      error: "Missing TikTok Access Token or Client Key",
    }
  }

  if (mediaUrls.length === 0) {
    return {
      platform: "tiktok",
      success: false,
      error: "TikTok requires a video attachment",
    }
  }

  try {
    const res = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_info: {
            title: tiktokTitle || caption.slice(0, 150),
            description: caption,
            privacy_level: "PUBLIC_TO_EVERYONE",
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
            video_cover_timestamp_ms: 1000,
          },
          source_info: {
            source: "PULL_FROM_URL",
            video_url: mediaUrls[0],
          },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok || data.error?.code !== "ok") {
      return {
        platform: "tiktok",
        success: false,
        error: data.error?.message || "TikTok Content Posting API rejected video",
      }
    }

    return {
      platform: "tiktok",
      success: true,
      postId: data.data?.publish_id,
    }
  } catch (error) {
    return {
      platform: "tiktok",
      success: false,
      error: String(error),
    }
  }
}
