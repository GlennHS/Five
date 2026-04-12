import Image from "next/image";

export default function SectionDivider() {
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
      <div className="w-full h-0.5 bg-black"></div>
    </div>
  )
}