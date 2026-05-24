// components/ScrollFadeContainer.tsx
"use client"

import { useRef, useState, useEffect } from "react"

type Props = {
  children: React.ReactNode
  maxHeight: string // e.g. "max-h-40"
  className?: string
}

export default function ScrollFadeContainer({ children, maxHeight, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const check = () => {
    const el = ref.current
    if (!el) return
    setIsScrollable(el.scrollHeight > el.clientHeight)
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 8)
  }

  useEffect(() => {
    check()
    // Re-check if content changes (e.g. actions load in)
    const observer = new ResizeObserver(check)
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [children])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        onScroll={check}
        className={`
          overflow-y-auto ${maxHeight}
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
          flex flex-col gap-3
        `}
      >
        {children}
      </div>

      {/* Bottom fade — only shown when scrollable and not at bottom */}
      <div
        className={`
          pointer-events-none absolute bottom-0 left-0 right-0 h-10
          bg-linear-to-t from-white to-transparent
          transition-opacity duration-300
          ${isScrollable && !atBottom ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  )
}