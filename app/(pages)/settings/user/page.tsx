"use client"

import BackLink from "@/app/components/BackLink"

export default function Page() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <BackLink />
      <h1 className="text-xl font-semibold mb-6">Edit User Settings</h1>
    </div>
  )
}