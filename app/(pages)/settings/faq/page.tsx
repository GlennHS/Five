"use client"

import BackLink from "@/app/components/BackLink";
import SectionDivider from "@/app/components/SectionDivider";

export default function Page() {
  return (
    <div>
      <BackLink />
      <h1 className="my-4! font-bold text-lg">FAQ</h1>

      <div className="flex flex-col gap-y-2 w-full">
        <SectionDivider />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-bond">Q. What do the little numbers next to the metrics on the homepage mean?</span>
          <span className="italic text-gray-700">A. Those numbers show the change in that metric over the past 24 hours</span>
        </div>
        <SectionDivider />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-bond">Q. Why can't I remove the "positive" and "negative" tags?</span>
          <span className="italic text-gray-700">A. Because they drive some of the stylings and behaviours in the app. If there's enough demand I can make it so you can remove them though.</span>
        </div>
        <SectionDivider />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-bond">Q. Hotel?</span>
          <span className="italic text-gray-700">A. Trivago.</span>
        </div>
        <SectionDivider />
      </div>
    </div>
  )
}