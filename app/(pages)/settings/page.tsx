"use client"

import BackLink from "@/app/components/BackLink"
import { useApp } from "@/app/context/AppContext"
import { db } from "@/app/db"
import Settings from "@/app/lib/settings"
import Link from "next/link"

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
  }
]

export default function Page() {
  const { loadFromDB } = useApp()

  const handleReset = async () => {
    if (confirm("Are you ABSOLUTELY SURE you want to RESET ALL YOUR DATA?")) {
      Settings.reset()
      await db.delete({disableAutoOpen: false})
      await db.open()
      loadFromDB()
    }
  }

  return (
    <div>
      <BackLink />
      <h1 style={{ marginBottom: 20 }}>Settings</h1>

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