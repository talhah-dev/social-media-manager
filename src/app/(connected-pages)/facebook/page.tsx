"use client"

import { FaFacebookF } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Open Meta for Developers & Create App",
    description: "Visit Meta for Developers and create a Business App.",
    actionUrl: "https://developers.facebook.com/apps/",
    actionText: "developers.facebook.com",
    details: [
      "Click 'Create App' > Select 'Business' or 'Other'.",
      "Assign your Meta Business Account.",
    ],
  },
  {
    step: 2,
    title: "Find Your Facebook Page ID",
    description: "Go to your Facebook Page > About section > Page Transparency, or inspect your Page URL to copy the numeric Page ID.",
    details: [
      "Look for the 15-16 digit numeric Page ID.",
      "Ensure your personal account is an Admin of this Page.",
    ],
  },
  {
    step: 3,
    title: "Generate Page Access Token",
    description: "Open the Graph API Explorer tool inside Meta Developer tools.",
    actionUrl: "https://developers.facebook.com/tools/explorer/",
    actionText: "Graph API Explorer",
    details: [
      "Select your App in the dropdown.",
      "Add Permissions: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`.",
      "Under 'User or Page', select your Facebook Page to generate a Page Access Token.",
    ],
  },
  {
    step: 4,
    title: "Paste Page ID & Token",
    description: "Copy your numeric Page ID and Page Access Token into Social Media Manager.",
    details: [
      "Optionally convert your short-lived token to a never-expiring Page Access Token via Access Token Debugger.",
      "Click 'Save & Connect' to activate Facebook posting.",
    ],
  },
]

export default function FacebookGuidePage() {
  return (
    <GuidePageLayout
      platformName="Facebook Page"
      icon={FaFacebookF}
      iconBg="bg-blue-600"
      developerPortalUrl="https://developers.facebook.com/apps/"
      requiredKeys={["Facebook Page ID", "Page Access Token"]}
      steps={STEPS}
    />
  )
}
