import Image from "next/image";

interface SectionDividerProps {
  text?: string,
}

export default function SectionDivider({ text }: SectionDividerProps) {
  return (
    <div className="w-full flex items-center gap-3 opacity-70 my-4">
      <div className={`h-px bg-gray-700 ${text ? "w-4" : "flex-1"}`} />

      <div className="flex items-center gap-1 shrink-0">
        <Image
          src="/images/icons/five-icon-128.png"
          alt=""
          width={16}
          height={16}
          className="grayscale opacity-70"
        />
        {text && (
          <span className="text-md font-medium text-gray-700 whitespace-nowrap">
            {text}
          </span>
        )}
      </div>

      <div className="flex-1 h-px bg-gray-700" />
    </div>
  );
}