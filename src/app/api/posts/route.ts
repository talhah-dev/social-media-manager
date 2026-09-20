import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { dispatchToPlatform, PublishResult } from "@/lib/publishers"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    return NextResponse.json(
      { success: false, data: [], error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      globalCaption = "",
      overrides = {},
      tiktokTitle = "",
      mediaUrls = [],
      targetPlatforms = [],
    } = body

    if (!globalCaption && Object.values(overrides || {}).every((v) => !v)) {
      return NextResponse.json(
        { success: false, error: "Post caption is required" },
        { status: 400 }
      )
    }

    const connectedAccounts = await prisma.socialAccount.findMany({
      where: {
        platform: { in: targetPlatforms },
        isConnected: true,
      },
    })

    const credentialsMap: Record<string, Record<string, string>> = {}
    for (const acc of connectedAccounts) {
      credentialsMap[acc.platform] = acc.credentials as Record<string, string>
    }

    const dispatchResults: PublishResult[] = []

    for (const platformId of targetPlatforms) {
      const creds = credentialsMap[platformId]
      const resolvedCaption = overrides[platformId]?.trim() || globalCaption

      if (!creds) {
        dispatchResults.push({
          platform: platformId,
          success: false,
          error: "No active API credentials found in database",
        })
        continue
      }

      const res = await dispatchToPlatform(platformId, {
        caption: resolvedCaption,
        mediaUrls,
        tiktokTitle,
        credentials: creds,
      })
      dispatchResults.push(res)
    }

    const successCount = dispatchResults.filter((r) => r.success).length
    let overallStatus = "PUBLISHED"
    if (successCount === 0 && dispatchResults.length > 0) {
      overallStatus = "FAILED"
    } else if (successCount < dispatchResults.length) {
      overallStatus = "PARTIAL"
    }

    const post = await prisma.post.create({
      data: {
        globalCaption,
        overrides: overrides || {},
        tiktokTitle: tiktokTitle || null,
        mediaUrls: mediaUrls || [],
        targetPlatforms: targetPlatforms || [],
        status: overallStatus,
      },
    })

    return NextResponse.json({
      success: true,
      post,
      dispatchResults,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing post ID" },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
