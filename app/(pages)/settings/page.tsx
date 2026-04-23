"use client"

import BackLink from "@/app/components/BackLink"
import SectionDivider from "@/app/components/SectionDivider"
import { useApp } from "@/app/context/AppContext"
import { db } from "@/app/db"
import { Settings } from "@/app/lib/settings"
import Link from "next/link"
import { useRouter } from "next/navigation"

const links = [
  {
    title: "Edit Tags",
    href: "/settings/tags",
    description: "Create, update and delete tags"
  },
  {
    title: "Edit Actions",
    href: "/settings/actions",
    description: "Manage action definitions"
  },
  {
    title: "App Settings",
    href: "/settings/user",
    description: "Manage user settings"
  },
  {
    title: "FAQ Page",
    href: "/settings/faq",
    description: "See common questions and answers"
  },
]

export default function Page() {
  const { loadFromDB } = useApp()
  const router = useRouter()

  const handleReset = async () => {
    if (confirm("Are you ABSOLUTELY SURE you want to RESET ALL YOUR DATA?")) {
      Settings.reset()
      await db.delete({disableAutoOpen: false})
      await db.open()
      loadFromDB()
    }
  }

  const handleTutorial = () => {
    Settings.set('wantsTutorial', 'true')
    router.push('/')
  }

  return (
    <div>
      <BackLink />
      <h1 className="my-4! font-bold text-lg">Settings</h1>

      <div className="flex flex-col gap-y-4 w-full">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="p-4 rounded-2xl border border-gray-300 w-full"
          >
            <div className="font-semibold">{link.title}</div>
            <div className="opacity-60 text-sm">
              {link.description}
            </div>
          </Link>
        ))}
        <button onClick={handleTutorial} className="p-4 rounded-2xl border border-mind bg-mind/20 w-full">
          <div className="font-semibold text-left">Tutorial</div>
          <div className="opacity-60 text-sm text-left">
            Do the tutorial again?
          </div>
        </button>
        <SectionDivider text="Danger Zone!"/>
        <button onClick={handleReset} className="p-4 rounded-2xl border border-red-600 bg-red-300 w-full">
          <div className="font-semibold">Reset Data</div>
          <div className="opacity-60 text-sm">
            Clear all custom actions/tags and action log. Start completely from scratch. THIS CANNOT BE UNDONE!
          </div>
        </button>
      </div>
    </div>
  )
}