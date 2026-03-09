import { Metric } from "../types"
import { useRouter } from "next/navigation";

type MetricCardProps = {
  className?: string;
  metric: Metric,
  onClick?: () => void;
}

export default function MetricCardLarge({ className, metric, isActive, onClick }: MetricCardProps) {
  const router = useRouter();
  const isTouch = typeof window !== "undefined" && "ontouchstart" in window;

  /**
   * If we're on mobile, first tap just selects (highlights), second tap navigates.
   * If we're on desktop, hover selects (highlights) and click navigates.
   */
  const handleClick = () => {
    const target = `/metrics/${metric.name.toLowerCase()}`;
    router.push(target);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between items-center
        bg-${metric.name.toLowerCase()}
        cursor-pointer select-none transition
        hover:-translate-y-0.5 hover:shadow-md
        ${className ? className : ""}
      `}
    >
      <h3 className="text-lg font-semibold tracking-wide">
        {metric.name}
      </h3>
      <p className="mt-2 text-2xl font-medium uppercase">
        {metric.value}
      </p>
    </div>
  )
}
