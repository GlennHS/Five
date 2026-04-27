import { Action, ActionDefinition, DailyMetric, MetricKey } from "@/app/types";
import dayjs, { Dayjs } from "dayjs";
import { isDateBetween } from "../dateTime";
import definitionAffectsMetric from "../actionDefinitions/definitionAffectsMetric";
import actionToMetrics from "../actions/actionToMetrics";
import sumMetrics from "./sumMetrics";
import buildActionMap from "../actions/buildActionMap";

export function getDailyMetric(actions: Action[], definitions: ActionDefinition[], metric: MetricKey, day: Dayjs): DailyMetric {
  const start = day.startOf('day')
  const end = day.endOf('day')

  const filteredActions = actions
    .filter(a => isDateBetween(dayjs(a.timestamp), start, end))
    .filter(a => {
      const def = definitions.find(d => d.id === a.actionId)
      if (def)
        return definitionAffectsMetric(def, metric)
      else return false
    })

  const actionMap = buildActionMap(definitions)

  const deltas = filteredActions.map(a =>
    actionToMetrics(a, actionMap)
  )

  return {
    metric,
    value: Math.floor(sumMetrics(deltas)[metric]),
    date: day
  }
}