import { Metric } from "../types"
import { useRouter } from "next/navigation";

type MetricCardProps = {
  metric: Metric,
  isActive?: boolean;
  onClick?: () => void;
}

export default function MetricCard({ metric, isActive, onClick }: MetricCardProps) {
  const router = useRouter();
  const isTouch = typeof window !== "undefined" && "ontouchstart" in window;

  /**
   * If we're on mobile, first tap just selects (highlights), second tap navigates.
   * If we're on desktop, hover selects (highlights) and click navigates.
   */
  const handleClick = () => {
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
        rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between
        bg-${metric.name.toLowerCase()}
        cursor-pointer select-none transition
        hover:-translate-y-0.5 hover:shadow-md
        ${isActive ? "opacity-100 ring-2 ring-offset-2 ring-slate-900 ring-offset-white" : "opacity-50"}
      `}
    >
      <h3 className="text-lg font-semibold tracking-wide">
        {metric.name}
      </h3>
      <p className="mt-2 text-sm font-medium opacity-90 uppercase">
        {metric.value}
      </p>
    </div>
  )
}
