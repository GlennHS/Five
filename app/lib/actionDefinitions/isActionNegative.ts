import { ActionDefinition, METRIC_KEYS } from "@/app/types";

export default function(def: ActionDefinition): boolean {
  let tot = 0
  METRIC_KEYS.forEach(k => tot += def[k] ?? 0)
  return tot < 0
}