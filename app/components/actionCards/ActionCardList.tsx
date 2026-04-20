import { useState } from "react"
import React from "react"

type ActionCardListProps = {
  children: React.ReactNode
  className?: string
}

export default function ActionCardList({ children, className }: ActionCardListProps) {
  const [scrolled, setScrolled] = useState(false)

  const childrenCount = React.Children.count(children)

  return (
    <div
      className={`w-full relative max-h-64 h-64 py-2 overflow-scroll border border-dashed border-gray-400 bg-gray-100 flex flex-col gap-y-4 ${className}`}
      onScroll={() => setScrolled(true)}
      id="action-list"
    >
      {childrenCount === 0 ? (
        <span className="w-full text-center text-sm absolute top-1/2 -translate-y-1/2 text-gray-500">
          Once you start logging, actions will go here
        </span>
      ) : (
        childrenCount > 2 && (<span
          className={`w-full text-center text-sm absolute top-1/2 bg-mind/50 py-2 border-y border-dashed border-black
          ${scrolled ? "transition-opacity duration-500 opacity-0" : ""}`}
        >
          Scroll to see more...
        </span> )
      )}

      {children}
    </div>
  )
}