import { PublishPayload, PublishResult } from "./types"

export async function publishToLinkedIn({
  caption,
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const token = credentials.accessToken
  const author = credentials.orgUrn || "urn:li:person:me"

  if (!token) {
    return {
      platform: "linkedin",
      success: false,
      error: "Missing LinkedIn Access Token",
    }
  }

  try {
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        author,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: caption,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        platform: "linkedin",
        success: false,
        error: data.message || "LinkedIn API publish failed",
      }
    }

    return {
      platform: "linkedin",
      success: true,
      postId: data.id,
    }
  } catch (error) {
    return {
      platform: "linkedin",
      success: false,
      error: String(error),
    }
  }
}
