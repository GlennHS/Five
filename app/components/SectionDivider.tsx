import Image from "next/image";

interface SectionDividerProps {
  text?: string
}

export default function SectionDivider({ text } : SectionDividerProps) {
  return (
    <div className="w-full flex gap-2 items-center justify-center opacity-20">
      <div className="w-full h-0.5 bg-black"></div>
      <Image
        src='/images/icons/five-icon-128.png'
        alt=''
        width={16}
        height={16}
        className="grayscale"
      />
      {text && <span className="italic text-sm font-bold max-w-48">{ text }</span> }
      <div className="w-full h-0.5 bg-black"></div>
    </div>
  )
}