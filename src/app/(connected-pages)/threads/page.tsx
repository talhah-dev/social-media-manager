"use client"

import { FaThreads } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Access Meta for Developers - Threads API",
    description: "Threads API is part of the Meta for Developers platform. Create an application with Threads use-case.",
    actionUrl: "https://developers.facebook.com/docs/threads",
    actionText: "developers.facebook.com/docs/threads",
    details: [
      "Click 'Create App' in Meta for Developers dashboard.",
      "Select 'Threads' as the use case.",
    ],
  },
  {
    step: 2,
    title: "Configure Threads API Permissions",
    description: "In your App Dashboard, add the required Threads API scopes.",
    details: [
      "Add `threads_basic` for reading user profile and account details.",
      "Add `threads_content_publish` for broadcasting posts, text, and media.",
      "Add `threads_read_replies` for thread interactions.",
    ],
  },
  {
    step: 3,
    title: "Generate Threads User Token & ID",
    description: "Generate a user access token for your authenticated Threads account.",
    details: [
      "Navigate to Threads > User Token Generator.",
      "Authorize your Threads profile to obtain your `threads_user_id` and long-lived Access Token.",
    ],
  },
  {
    step: 4,
    title: "Connect Threads to Social Media Manager",
    description: "Paste your numeric User ID and Threads Access Token into the connection modal.",
    details: [
      "Paste your 'Threads User ID'.",
      "Paste your 'Threads Access Token'.",
      "Click 'Save & Connect' to enable instant cross-posting.",
    ],
  },
]

export default function ThreadsGuidePage() {
  return (
    <GuidePageLayout
      platformName="Threads"
      icon={FaThreads}
      iconBg="bg-zinc-950 border border-zinc-800"
      developerPortalUrl="https://developers.facebook.com/docs/threads"
      requiredKeys={["Threads User ID", "Threads Access Token"]}
      steps={STEPS}
    />
  )
}
