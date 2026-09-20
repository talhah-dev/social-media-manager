"use client"

import { FaTiktok } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Access TikTok for Developers",
    description: "Open the TikTok Developer Portal and log in with your TikTok account to register as a developer.",
    actionUrl: "https://developers.tiktok.com/",
    actionText: "developers.tiktok.com",
    details: [
      "Click 'Register' or 'Log in' on the top right.",
      "Complete developer verification if requested.",
    ],
  },
  {
    step: 2,
    title: "Create a New Application",
    description: "Navigate to 'Manage apps' in your developer console and click 'Create App'.",
    details: [
      "Select 'Web' as the app category.",
      "Fill in your App Name, App Icon, and Description.",
    ],
  },
  {
    step: 3,
    title: "Add Content Posting API Product",
    description: "In your App details page, navigate to 'Add products' and add 'Content Posting API' and 'Share to TikTok'.",
    details: [
      "Request permissions for `video.upload` and `video.publish`.",
      "Submit the product configuration for development access.",
    ],
  },
  {
    step: 4,
    title: "Retrieve Client Key & Client Secret",
    description: "Go to Basic Settings > App Details to view your App Credentials.",
    details: [
      "Copy your 'Client Key'.",
      "Click 'Show' to copy your 'Client Secret'.",
      "Generate or paste your authorized User Access Token.",
    ],
  },
]

export default function TikTokGuidePage() {
  return (
    <GuidePageLayout
      platformName="TikTok"
      icon={FaTiktok}
      iconBg="bg-black border border-zinc-800"
      developerPortalUrl="https://developers.tiktok.com/"
      requiredKeys={["Client Key", "Client Secret", "Access Token"]}
      steps={STEPS}
    />
  )
}
