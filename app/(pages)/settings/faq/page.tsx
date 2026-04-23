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
          <span className="font-bold text-bond">Q. Can I remove the "positive" and "negative" tags?</span>
          <span className="italic text-gray-700">A. Yup! It won't break anything. I find them useful though for tracking "good" and "bad" behaviours/habits you want to maintain/break.</span>
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