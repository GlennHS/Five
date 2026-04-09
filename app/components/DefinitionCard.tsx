import { toSentenceCase } from "../lib/utils";
import { ActionDefinition, METRIC_KEYS, MetricKey } from "../types";
import TagPill from "./TagPill";

interface Props {
  definition: ActionDefinition;
  className?: string;
}

export default function DefinitionCard({ definition, className } : Props) {
  const getBGString = (key: MetricKey, def: ActionDefinition): string => {
    if (def[key] && def[key] !== 0)
      return `bg-${key}/50`
    else
      return `bg-${key}/10`
  }

  return (
    <div
      key={definition.id}
      className={`flex flex-col items-baseline gap-2 ${className}`}
    >
      {/* Top */}
      <div className="flex w-full justify-between gap-1">
        <div className="font-medium">{definition.name}</div>
      </div>

      <div className="flex gap-x-2 flex-wrap w-full">
        {definition.tags.map(tag => (
          <TagPill
            key={tag.id}
            tag={tag.name}
            color={tag.colorKey}
          />
        ))}
      </div>

      <div className="flex rounded-xl border-black border-2 overflow-hidden w-full">
        {METRIC_KEYS.map((key, i) => (
          <div key={key} className={`flex flex-col gap-0.5 px-1 py-0.5 ${getBGString(key, definition)} w-full ${i === 0 ? "rounded-l-xl" : ""} ${i === METRIC_KEYS.length - 1 ? "rounded-r-l" : ""}`}>
            <span className="text-center text-sm">{toSentenceCase(key)}</span>
            <span className="text-center text-sm">{definition[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}