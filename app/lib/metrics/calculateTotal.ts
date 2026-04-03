import { Dayjs } from "dayjs"
import { Action, ActionDefinition } from "@/app/types"
import { calculateMetricsForRange } from "./calculateMetricsForRange"

const calculateTotal = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs
) : number => {
  const totals = calculateMetricsForRange(actions, defs, from, to)
  return Math.floor(Object.values(totals).reduce((a,b) => a + b) / 5)
}

export default  calculateTotal
