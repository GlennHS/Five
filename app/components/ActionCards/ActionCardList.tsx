import React from "react"
import ScrollFadeContainer from "../ScrollFadeContainer"

type ActionCardListProps = {
  children: React.ReactNode
  className?: string
}

export default function ActionCardList({ children, className }: ActionCardListProps) {
  const childrenCount = React.Children.count(children)

  return (
    <div id="action-list" className={`flex flex-col gap-3 ${className}`}>
      {childrenCount === 0 && (
        <span className="w-full text-center text-sm absolute top-1/2 -translate-y-1/2 text-gray-500">
          Once you start logging, actions will go here
        </span>
      )}
      {children}
    </div>
  )
}