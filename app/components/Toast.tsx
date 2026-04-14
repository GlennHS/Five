import { useEffect, useState } from "react";
import { pickRandom } from "../lib/utils";

type BottomToastProps = {
  text: string
  className?: string
  show: boolean
  duration?: number
  onDismiss: () => void
};

export default function Toast({
  text,
  className,
  show,
  duration,
  onDismiss
}: BottomToastProps) {
  const [visible, setVisible] = useState(show);
  const [outlineClass, setOutlineClass] = useState('outline-mind')

  const possibleOutlines = [
    'outline-mind',
    'outline-body',
    'outline-cash',
    'outline-work',
    'outline-bond',
  ]

  useEffect(() => {
    setVisible(show)
  }, [show])

  useEffect(() => { show && setOutlineClass(pickRandom(possibleOutlines)) }, [show])

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-300
        ${visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-4"}`}
        onClick={onDismiss}
    >
      <div
        className={`
          rounded-2xl px-4 py-3
          drop-shadow-2xl shadow-2xl shadow-black
          border border-white/10 outline-2 ${outlineClass}
          ring-1 ring-black/5
          text-sm text-gray-800 font-bold
          transition-all duration-300
          backdrop-blur supports-[backdrop-filter]:bg-white/60
          ${className}
        `}
      >
        {text}
      </div>
    </div>
  );
}