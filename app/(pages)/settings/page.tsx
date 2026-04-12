"use client"

import BackLink from "@/app/components/BackLink"
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
  }
]

export default function Page() {
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
      </div>
    </div>
  )
}