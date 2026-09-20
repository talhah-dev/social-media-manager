import { PublishPayload, PublishResult } from "./types"
import { publishToTwitter } from "./twitter"
import { publishToLinkedIn } from "./linkedin"
import { publishToFacebook } from "./facebook"
import { publishToInstagram } from "./instagram"
import { publishToThreads } from "./threads"
import { publishToTikTok } from "./tiktok"

export * from "./types"

export async function dispatchToPlatform(
  platformId: string,
  payload: PublishPayload
): Promise<PublishResult> {
  switch (platformId) {
    case "twitter":
      return publishToTwitter(payload)
    case "linkedin":
      return publishToLinkedIn(payload)
    case "facebook":
      return publishToFacebook(payload)
    case "instagram":
      return publishToInstagram(payload)
    case "threads":
      return publishToThreads(payload)
    case "tiktok":
      return publishToTikTok(payload)
    default:
      return {
        platform: platformId,
        success: false,
        error: `Unsupported platform ${platformId}`,
      }
  }
}
