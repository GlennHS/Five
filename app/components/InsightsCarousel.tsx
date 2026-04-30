"use client";

import { useInViewAnimation } from "./useInViewAnimation";
import { Swiper, SwiperSlide } from "swiper/react";

import { Insight } from "../hooks/useInsights";
import { METRIC_INFO } from "../constants/Constants";

function InsightCard({ insight }: { insight: Insight }) {
  const metricInfo = insight.metric !== undefined ? METRIC_INFO[insight.metric] : null

  return (
    <div
      className={`
        flex flex-col justify-center
        h-full rounded-2xl border p-4 shadow-sm
        bg-${insight.metric}/20
        border-2 border-${insight.metric} ${insight.tone === "negative" && "border-dashed"}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-xl
            text-${insight.metric}
            bg-white/50
            aspect-square
          `}
        >
          { metricInfo && <metricInfo.icon /> }
        </div>

        <p
          className={`
            text-sm font-medium leading-snug
            text-${insight.metric}
          `}
        >
          {insight.text}
        </p>
      </div>
    </div>
  );
}

export default function InsightsCarousel({ insights } : { insights: Insight[] }) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 delay-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="space-y-4">
        {/* Swiper container */}
        <Swiper
          spaceBetween={12}
          slidesPerView={1.1} // peeking next card = good affordance
          className="!items-stretch"
        >
          {insights.map((insight) => (
            <SwiperSlide key={insight.id} className="!h-auto flex">
              <InsightCard insight={insight} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}