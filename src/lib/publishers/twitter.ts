import crypto from "crypto"
import { PublishPayload, PublishResult } from "./types"

function generateOAuth1Header(
  method: string,
  url: string,
  keys: {
    apiKey: string
    apiSecret: string
    accessToken: string
    accessTokenSecret: string
  }
) {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: keys.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: keys.accessToken,
    oauth_version: "1.0",
  }

  const sortedKeys = Object.keys(oauthParams).sort()
  const paramString = sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&")

  const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`
  const signingKey = `${encodeURIComponent(keys.apiSecret)}&${encodeURIComponent(keys.accessTokenSecret)}`
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64")

  const headerParams = {
    ...oauthParams,
    oauth_signature: signature,
  }

  return (
    "OAuth " +
    Object.keys(headerParams)
      .sort()
      .map(
        (k) =>
          `${encodeURIComponent(k)}="${encodeURIComponent(headerParams[k as keyof typeof headerParams])}"`
      )
      .join(", ")
  )
}

export async function publishToTwitter({
  caption,
  credentials,
}: PublishPayload): Promise<PublishResult> {
  const apiKey = credentials.apiKey
  const apiSecret = credentials.apiSecret
  const accessToken = credentials.accessToken
  const accessTokenSecret = credentials.accessTokenSecret

  let authHeader = ""

  if (apiKey && apiSecret && accessToken && accessTokenSecret) {
    authHeader = generateOAuth1Header(
      "POST",
      "https://api.twitter.com/2/tweets",
      { apiKey, apiSecret, accessToken, accessTokenSecret }
    )
  } else if (accessToken || apiKey) {
    authHeader = `Bearer ${accessToken || apiKey}`
  } else {
    return {
      platform: "twitter",
      success: false,
      error: "Missing Twitter API Credentials (API Key, API Secret, Access Token, and Access Token Secret)",
    }
  }

  try {
    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        text: caption,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const errMessage =
        data.detail ||
        data.title ||
        (data.errors && data.errors[0]?.message) ||
        "Twitter API request rejected"
      return {
        platform: "twitter",
        success: false,
        error: errMessage,
      }
    }

    return {
      platform: "twitter",
      success: true,
      postId: data.data?.id,
    }
  } catch (error) {
    return {
      platform: "twitter",
      success: false,
      error: String(error),
    }
  }
}

