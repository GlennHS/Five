import { v4 as uuidv4 } from 'uuid'
import { Action, ActionDB, ActionDefinition, ActionDefinitionDB, ActionDetails, FiveMetric, Metric, METRIC_KEYS, MetricKey, MetricSnapshot, MetricSnapshotHistory, Tag, TagDB, TimeGroup } from '../types'
import { convertTimestampToDayJS, getDaysSinceDate, isDateBetween } from './dateTime'
import { Dayjs } from 'dayjs'


export const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

export const createLineChartData = (labels: string[] = days, values: number[][]) : object => {
  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Metrics',
        data: values,
        pointHitRadius: 20  
      }]
    },
    options: {
      scales: {
        y: {
          min: 0,
          suggestedMax: 70,
          beginAtZero: true,
          ticks: {
            stepSize: 20
          },
        },
      },
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  }
}

export const createLineChartData_Week = (values: number[][]): object => createLineChartData(days, values)

export const toSentenceCase = (s: string) : string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

export const pickRandom = <T>(a: T[]): T => {
  return a[Math.floor(Math.random() * a.length)]
}

export const createRandomUUID = () => uuidv4()

export const calculateMetricValueFromHistory = (metricName: string, history: Partial<MetricSnapshotHistory>): number => {
  let totalValue = 0;

  const metricValues = Object.values(history).map(snapshot => snapshot[metricName as keyof MetricSnapshot]);
  totalValue = metricValues.reduce((acc, value) => acc + value, 0);

  return totalValue;
}

export const getMetricsFromSnapshot = (m: MetricSnapshot | undefined): Metric[] => {
  if (!m) { return [] }

  return [
    {
      name: "mind",
      value: m.mind,
    },
    {
      name: "body",
      value: m.body,
    },
    {
      name: "work",
      value: m.work,
    },
    {
      name: "cash",
      value: m.cash,
    },
    {
      name: "bond",
      value: m.bond,
    },
  ]
}

export const getMetricScore = (
  actionHistory: Action[],
  actionDefinitions: ActionDefinition[],
  metricKey: MetricKey,
  from: Dayjs,
  to: Dayjs
): number => {
  return calculateMetricsForRange(
    actionHistory,
    actionDefinitions,
    from,
    to
  )[metricKey]
}

/**
 * @description Used to get values for FiveLineGraph
 * @param actionHistory action history from app data
 * @param actionDefinitions action definitions from app data
 * @param metricKey the metric to be queried
 * @param from date from
 * @param to date to
 * @param groupBy time period to group by
 * @returns Array of numbers where each number represents the sum of the metric change for that time period group
 * @
 */
export const getMetricSeries = (
  actionHistory: Action[],
  actionDefinitions: ActionDefinition[],
  metricKey: MetricKey,
  from: Dayjs,
  to: Dayjs,
  groupBy: TimeGroup
): number[] => {

  const values: number[] = []

  const actions = actionHistory
  const defs = actionDefinitions

  let accumulator = 0

  let cursor = from.startOf(groupBy)

  while (cursor.isBefore(to) || cursor.isSame(to)) {

    const bucketStart = cursor
    const bucketEnd = cursor.endOf(groupBy)

    const metrics = calculateMetricsForRange(
      actions,
      defs,
      bucketStart,
      bucketEnd
    )

    accumulator += metrics[metricKey]

    values.push(accumulator)

    cursor = cursor.add(1, groupBy)
  }

  return values
}

export const filterActionsByRange = (actions: Action[], from: Dayjs, to: Dayjs ): Action[] =>
  actions.filter(a => isDateBetween(convertTimestampToDayJS(a.timestamp), from, to))

export const buildActionMap = (
  defs: ActionDefinition[]
): Record<string, ActionDefinition> =>
  Object.fromEntries(defs.map(d => [d.id, d]))

export const actionToMetrics = (
  action: Action,
  actionMap: Record<string, ActionDefinition>,
  decay?: number,
): Partial<FiveMetric> => {

  const def = actionMap[action.actionId]
  if (!def) return {}

  return {
    mind: def.mind ? applyDecayToMetric(def.mind, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    body: def.body ? applyDecayToMetric(def.body, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    work: def.work ? applyDecayToMetric(def.work, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    cash: def.cash ? applyDecayToMetric(def.cash, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    bond: def.bond ? applyDecayToMetric(def.bond, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  }
}

export const sumMetrics = (
  deltas: Partial<FiveMetric>[]
): FiveMetric => {

  const r: FiveMetric = { mind: 0, body: 0, work: 0, cash: 0, bond: 0 }

  deltas.forEach(d => {
    METRIC_KEYS.forEach(k => {
      r[k] += d[k] ?? 0
    })
  })

  METRIC_KEYS.forEach(k => r[k] = Math.floor(r[k]))

  return r
}

const applyDecayToMetric = (m: number, decay: number, days: number): number => m * Math.pow(decay, days)

export const calculateMetricsForRange = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs
): FiveMetric => {

  const actionMap = buildActionMap(defs)

  const filtered = filterActionsByRange(actions, from, to)

  const deltas = filtered.map(a =>
    actionToMetrics(a, actionMap, 0.9)
  )

  return sumMetrics(deltas)
}

export const actionAffectsMetric = (
  action: Action,
  defs: ActionDefinition[],
  metric: MetricKey
): boolean => {

  const def = defs.find(d => d.id === action.actionId)
  if (!def) return false

  return (def[metric] ?? 0) !== 0
}

export const getNonZeroMetrics = (metrics: FiveMetric) => {
  return METRIC_KEYS
    .filter(k => metrics[k] !== 0)
    .map(k => ({
      key: k,
      value: metrics[k]
    }))
}

export const calculateTotal = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs
) : number => {
  const totals = calculateMetricsForRange(actions, defs, from, to)
  return Math.floor(Object.values(totals).reduce((a,b) => a + b) / 5)
}

export const resolveActionDetails = (
  action: Action,
  defs: ActionDefinition[]
): ActionDetails | null => {

  const def = defs.find(d => d.id === action.actionId)
  if (!def) return null

  return {
    id: action.id,
    name: def.name,
    tags: def.tags ?? [],
    timestamp: action.timestamp,
    note: action.note,
    metrics: {
      mind: def.mind ?? 0,
      body: def.body ?? 0,
      work: def.work ?? 0,
      cash: def.cash ?? 0,
      bond: def.bond ?? 0
    }
  }
}

export const getDominantMetric = (metrics: FiveMetric): MetricKey | null => {

  let best: MetricKey | null = null
  let bestValue = 0

  METRIC_KEYS.forEach(k => {
    const value = Math.abs(metrics[k])

    if (value > bestValue) {
      best = k
      bestValue = value
    }
  })

  return best
}

export const metricToCardClasses = (metric: MetricKey | null) => {
  let className = ""
  if (!metric) className += "border-total bg-total/10"
  else className += `border-${metric} bg-${metric}/10`
  return className
}

export function hydrateActionDefinitions(
  defs: ActionDefinitionDB[],
  tags: TagDB[]
): ActionDefinition[] {
  const tagMap = new Map(tags.map(t => [t.id, t]))

  return defs.map(def => {
    const hydratedTags = def.tagIds
      .map(id => tagMap.get(id))
      .filter(Boolean) as Tag[]

    return {
      id: def.id!,
      name: def.name,
      tags: hydratedTags.length > 0 ? hydratedTags : [],
      mind: def.mind,
      body: def.body,
      work: def.work,
      cash: def.cash,
      bond: def.bond,
      archived: def.archived,
    }
  })
}

// For completeness' sake, in case one definition changes in future
export function hydrateActions(
  defs: ActionDB[],
): Action[] {
    return defs.map(d => {
      return {
        ...d
      }
    })
}

export function sortDefinitionsByRecentUse(
  defs: ActionDefinitionDB[],
  actions: Action[]
) {
  const latestMap = new Map<number, number>()

  for (const action of actions) {
    const current = latestMap.get(action.actionId)

    if (!current || action.timestamp > current) {
      latestMap.set(action.actionId, action.timestamp)
    }
  }

  return [...defs].sort((a, b) => {
    const aTime = latestMap.get(a.id!) ?? 0
    const bTime = latestMap.get(b.id!) ?? 0

    return bTime - aTime // newest first
  })
}
