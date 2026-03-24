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

export default function SettingsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <BackLink />
      <h1 style={{ marginBottom: 20 }}>Settings</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #ccc",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{ fontWeight: 600 }}>{link.title}</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              {link.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}