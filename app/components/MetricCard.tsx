import { ArrowBigDown, ArrowBigUp, Equal } from "lucide-react";
import { Metric } from "../types"
import { useRouter } from "next/navigation";

type MetricCardProps = {
  className?: string
  metric: Metric
  delta?: number
  isActive?: boolean
  isTotal?: boolean
  onClick?: () => void
}

export default function MetricCard({ className, metric, delta, isActive, isTotal, onClick }: MetricCardProps) {
  const router = useRouter();
  const isTouch = typeof window !== "undefined" && "ontouchstart" in window;

  /**
   * If we're on mobile, first tap just selects (highlights), second tap navigates.
   * If we're on desktop, hover selects (highlights) and click navigates.
   */
  const handleClick = () => {
    if (metric.name === "total") return
    const target = `/metrics/${metric.name.toLowerCase()}`;

    if (isTouch) {
      if (!isActive) {
        onClick?.();
      } else {
        router.push(target);
      }
    } else {
      router.push(target);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouch) {
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between items-center
        bg-${metric.name.toLowerCase()}${isActive || isTotal ? "" : "/50"}
        cursor-pointer select-none transition
        hover:-translate-y-0.5 hover:shadow-md
        ${isActive ? "ring-2 ring-offset-2 ring-slate-900 ring-offset-white" : ""}
        ${className ? className : ""}
      `}
    >
      <h3 className="text-lg font-semibold tracking-wide uppercase">
        {metric.name}
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p className="text-lg font-medium">
          {metric.value}
        </p>
        {delta != undefined && delta > 0 && (
          <ArrowBigUp size={20} strokeWidth={1} stroke="#007b2a" fill="#009b39" />
        )}
        {delta != undefined && delta === 0 && (
          <Equal size={20} strokeWidth={3} stroke="#dedede" />
        )}
        {delta != undefined && delta < 0 && (
          <ArrowBigDown size={20} strokeWidth={1} stroke="darkred" fill="red" />
        )}
      </div>
    </div>
  )
}
