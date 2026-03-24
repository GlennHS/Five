import { TAG_COLOR_CLASSES, TagColorKey } from "@/app/fixtures/Colors"

type TagPillProps = {
  tag: string,
  color: TagColorKey,
}

export default function TagPill({ tag, color }: TagPillProps) {
  const tagClass = TAG_COLOR_CLASSES[color]

  return (
    <div className={`w-fit px-2 py-0.5 text-xs font-medium tracking-wide rounded-full border border-black ${tagClass}`}>
      <span>{ tag }</span>
    </div>
  )
}
