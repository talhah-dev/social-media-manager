"use client"

import { FaLinkedinIn } from "react-icons/fa6"
import { GuidePageLayout, GuideStep } from "@/components/guide-page-layout"

const STEPS: GuideStep[] = [
  {
    step: 1,
    title: "Access LinkedIn Developer Portal",
    description: "Go to the LinkedIn Developer portal and click 'Create App'.",
    actionUrl: "https://www.linkedin.com/developers/apps",
    actionText: "linkedin.com/developers",
    details: [
      "Enter your App Name, LinkedIn Page URL, and upload your App Logo.",
      "Associate your verified LinkedIn Company Page.",
    ],
  },
  {
    step: 2,
    title: "Request API Products",
    description: "In the 'Products' tab of your LinkedIn app, add publishing permissions.",
    details: [
      "Add 'Share on LinkedIn' (grants `w_member_social`).",
      "Add 'Sign In with LinkedIn using OpenID Connect' (grants `openid`, `profile`, `email`).",
      "If posting to a company page, request 'Community Management API' (`w_organization_social`).",
    ],
  },
  {
    step: 3,
    title: "Retrieve Client ID & Client Secret",
    description: "Navigate to the 'Auth' tab to view your Application Credentials.",
    details: [
      "Copy your 'Client ID'.",
      "Click the eye icon to view and copy your 'Client Secret'.",
    ],
  },
  {
    step: 4,
    title: "Obtain Member / Organization URN & Access Token",
    description: "Find your numeric LinkedIn URN identifier and generate your OAuth Bearer token.",
    details: [
      "For Personal accounts: `urn:li:person:<id>`",
      "For Company Pages: `urn:li:organization:<companyId>` (Found in your page admin URL).",
      "Paste your URN and Access Token into the LinkedIn Connect dialog in Social Media Manager.",
    ],
  },
]

export default function LinkedInGuidePage() {
  return (
    <GuidePageLayout
      platformName="LinkedIn"
      icon={FaLinkedinIn}
      iconBg="bg-[#0A66C2]"
      developerPortalUrl="https://www.linkedin.com/developers/apps"
      requiredKeys={["Organization / Author URN", "OAuth Access Token"]}
      steps={STEPS}
    />
  )
}
