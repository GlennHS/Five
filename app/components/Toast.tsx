import { useEffect, useState } from "react";

type BottomToastProps = {
  text: string;
  className?: string;
  show: boolean;
  duration?: number; // ms
  onClose?: () => void;
};

export default function Toast({
  text,
  className,
  show,
  duration = 3000,
  onClose,
}: BottomToastProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-300
        ${visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-4"}`}
        onClick={() => setVisible(false)}
    >
      <div
        className={`rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 text-sm text-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${className}`}
      >
        {text}
      </div>
    </div>
  );
}