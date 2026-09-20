"use client"

import { FaInstagram } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Switch to Instagram Business / Creator Account",
    description: "Instagram Graph API requires a Professional (Business or Creator) account linked to a Facebook Page.",
    details: [
      "Open Instagram app > Settings > Account type > Switch to Professional Account.",
      "Link your Instagram professional account to a Facebook Page in Page Settings.",
    ],
  },
  {
    step: 2,
    title: "Create App in Meta for Developers",
    description: "Go to Meta for Developers dashboard and click 'Create App'.",
    actionUrl: "https://developers.facebook.com/apps/",
    actionText: "developers.facebook.com",
    details: [
      "Select 'Other' or 'Business' as the app type.",
      "Enter your App Display Name and contact email.",
    ],
  },
  {
    step: 3,
    title: "Add Instagram Graph API Product",
    description: "From the App Dashboard, locate 'Instagram Graph API' and click 'Set Up'.",
    details: [
      "Add permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.",
      "Generate a long-lived Access Token via Graph API Explorer.",
    ],
  },
  {
    step: 4,
    title: "Find Instagram Business Account ID & Access Token",
    description: "Query your Facebook Page in Graph API Explorer to find your connected Instagram Business ID.",
    details: [
      "GET `/me/accounts` to retrieve your page token.",
      "GET `/{page-id}?fields=instagram_business_account` to get your numeric Account ID.",
      "Paste both the 'Instagram Account ID' and 'Graph API Access Token' into Social Media Manager.",
    ],
  },
]

export default function InstagramGuidePage() {
  return (
    <GuidePageLayout
      platformName="Instagram"
      icon={FaInstagram}
      iconBg="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600"
      developerPortalUrl="https://developers.facebook.com/apps/"
      requiredKeys={["Instagram Account ID", "Graph API Access Token"]}
      steps={STEPS}
    />
  )
}
