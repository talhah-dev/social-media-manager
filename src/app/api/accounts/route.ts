import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const accounts = await prisma.socialAccount.findMany({
      where: { isConnected: true },
    })
    const data: Record<string, Record<string, string>> = {}
    for (const acc of accounts) {
      data[acc.platform] = acc.credentials as Record<string, string>
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, data: {}, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { platform, credentials } = body

    if (!platform || !credentials) {
      return NextResponse.json(
        { success: false, error: "Missing platform or credentials" },
        { status: 400 }
      )
    }

    
    const account = await prisma.socialAccount.upsert({
      where: { platform },
      update: {
        credentials,
        isConnected: true,
      },
      create: {
        platform,
        credentials,
        isConnected: true,
      },
    })

    return NextResponse.json({ success: true, account })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json(
        { success: false, error: "Missing platform" },
        { status: 400 }
      )
    }

    await prisma.socialAccount.deleteMany({
      where: { platform },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
