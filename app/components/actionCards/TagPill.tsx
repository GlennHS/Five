import { TAG_COLOR_CLASSES } from "@/app/fixtures/Colors"

type TagPillProps = {
  tag: string,
  color: keyof typeof TAG_COLOR_CLASSES,
}

export default function TagPill({ tag, color }: TagPillProps) {
  const tagClass = TAG_COLOR_CLASSES[color]
  
  return (
    <div className={`w-fit px-2 py-0.5 text-sm rounded-full border border-black ${tagClass}`}>
      <span>{ tag }</span>
    </div>
  )
}
