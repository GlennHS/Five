"use client";

import { useInViewAnimation } from "./useInViewAnimation";
import { Insight, INSIGHT_CATEGORIES, InsightCategory } from "../hooks/useInsights";
import { METRIC_INFO } from "../constants/Constants";
import { useState, useRef, useEffect } from "react";
import { toSentenceCase } from "../lib/utils";
import { ChevronRight } from "lucide-react";

function InsightCard({ insight }: { insight: Insight }) {
  const metricInfo = insight.metric !== undefined ? METRIC_INFO[insight.metric] : null;

  return (
    <div
      className={`
        flex flex-col justify-center
        h-full rounded-2xl border p-4 shadow-sm
        bg-${insight.metric}/20
        border-2 border-${insight.metric}
        ${insight.tone === "negative" ? "border-dashed" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-xl
            text-${insight.metric}
            bg-white/50
            aspect-square shrink-0
          `}
        >
          {metricInfo && <metricInfo.icon />}
        </div>
        <p className={`text-sm font-medium leading-snug text-${insight.metric}`}>
          {insight.text}
        </p>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  insights,
  isExpanded,
  onToggle,
}: {
  category: InsightCategory;
  insights: Insight[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept horizontal scrolls
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.stopPropagation();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    el.addEventListener("touchstart", handleTouch, { passive: true });
    el.addEventListener("touchmove", handleTouch, { passive: true });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouch);
      el.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setAtEnd(isAtEnd);
  };

  const label = `${toSentenceCase(category)} (${insights.length})`;

  return (
    <div
      className={`
        flex rounded-2xl bg-gray-100 p-2 shrink-0
        transition-all duration-500 ease-in-out
        ${isExpanded ? "w-11/12" : "w-12"}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="flex flex-col items-center justify-between gap-3 px-1 py-1 border-r-2 border-gray-300 shrink-0"
      >
        <span
          className="
            text-xs font-medium text-neutral-600
            [writing-mode:vertical-rl] rotate-180
            whitespace-nowrap
          "
        >
          {label}
        </span>
        <span
          className={`text-neutral-500 transition-transform duration-300 ${
            isExpanded ? "rotate-90" : "-rotate-90"
          }`}
        >
          <ChevronRight size={12} />
        </span>
      </button>

      {/* Collapsible content */}
      <div
        className={`
          relative overflow-hidden flex flex-col justify-center
          transition-all duration-500 ease-in-out py-4
          ${isExpanded ? "w-full opacity-100 ml-2" : "w-0 opacity-0"}
        `}
      >
        <div className="relative">
          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {insights.map((insight) => (
              <div key={insight.id} className="min-w-56 max-w-64 shrink-0">
                <InsightCard insight={insight} />
              </div>
            ))}
          </div>

          <div
            className={`
              pointer-events-none absolute right-0 top-0 h-full w-8
              bg-linear-to-l from-neutral-100 to-transparent
              transition-opacity duration-300
              ${atEnd ? "opacity-0" : "opacity-100"}
            `}
          />
        </div>
      </div>
    </div>
  );
}

export default function InsightsCarousel({ insights }: { insights: Insight[] }) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();
  const [expandedCategories, setExpandedCategories] = useState<InsightCategory[]>(["performance"]);

  const toggleCategory = (category: InsightCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 delay-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth"
           style={{ scrollbarWidth: "none" }}>
        {INSIGHT_CATEGORIES.map((category) => {
          const categoryInsights = insights
            .filter((i) => i.category === category)
            .sort((a, b) => a.priority - b.priority);

          return (
            <CategorySection
              key={category}
              category={category}
              insights={categoryInsights}
              isExpanded={expandedCategories.includes(category)}
              onToggle={() => toggleCategory(category)}
            />
          );
        })}
      </div>
    </section>
  );
}
