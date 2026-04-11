import { TAG_COLOR_CLASSES, TagColorKey } from "@/app/constants/Colors"
import { Circle } from "lucide-react"

type TagPillProps = {
  tag: string,
  color: TagColorKey,
}

export default function TagPill({ tag, color }: TagPillProps) {
  const tagClass = TAG_COLOR_CLASSES[color]

  return (
    <div className={`w-fit px-2 py-0.5 text-xs font-medium tracking-wide rounded-full border border-black ${tagClass}`}>
      <span className="flex items-center gap-x-1">
        <Circle strokeWidth={0} fill={color} size={8}/>
        { tag }
      </span>
    </div>
  )
}
