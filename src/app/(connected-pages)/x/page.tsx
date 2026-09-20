"use client"

import { FaXTwitter } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Log into the X (Twitter) Developer Portal",
    description: "Navigate to the developer portal and sign in with your X account. Make sure you have an active Developer account tier.",
    actionUrl: "https://developer.x.com/en/portal/dashboard",
    actionText: "developer.x.com",
    details: [
      "Ensure your developer account has Free, Basic, or Pro tier enabled.",
      "Accept the Developer Agreement and Policy if prompted.",
    ],
  },
  {
    step: 2,
    title: "Create a Project and App",
    description: "In the Developer Portal dashboard, click on '+ Add Project' or '+ Add App'. Provide a name for your application.",
    details: [
      "Select your use-case (e.g., 'Building social tools' or 'Publishing bots').",
      "Give your application a recognizable name.",
    ],
  },
  {
    step: 3,
    title: "Set User Authentication Settings & Permissions",
    description: "Go to your App settings > User authentication settings > Edit.",
    details: [
      "Select App permissions: Set to 'Read and Write' or 'Read and Write and Direct message'.",
      "Type of App: Select 'Web App, Automated App or Bot'.",
      "Callback URL / Redirect URI: Enter https://localhost or your domain URL.",
      "Website URL: Enter your website URL.",
    ],
  },
  {
    step: 4,
    title: "Generate API Key, API Secret & Access Tokens",
    description: "Navigate to the 'Keys and Tokens' tab of your app.",
    details: [
      "Under 'Consumer Keys', click Generate to copy your 'API Key' and 'API Key Secret'.",
      "Under 'Authentication Tokens', generate the 'Access Token and Secret' (both Access Token & Access Token Secret).",
      "Copy all 4 values into the X Connect Dialog in Social Media Manager.",
    ],
  },
]

export default function XGuidePage() {
  return (
    <GuidePageLayout
      platformName="X (Twitter)"
      icon={FaXTwitter}
      iconBg="bg-zinc-900 border border-zinc-700"
      developerPortalUrl="https://developer.x.com/en/portal/dashboard"
      requiredKeys={["API Key", "API Secret Key", "Access Token", "Access Token Secret"]}
      steps={STEPS}
    />
  )
}
