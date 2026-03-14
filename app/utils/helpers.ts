import { v4 as uuidv4 } from 'uuid'
import { Action, Metric, MetricSnapshot, MetricSnapshotHistory } from '../types'


export const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

export const calculateTotal = (five: number[]) : number => {
  if (five.length !== 5)
    return 0
  else
    return five.reduce((a,b) => a + b) / 5
}

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

// #region Time Utils
export const DateToTimestamp = (d: Date): number => d.getTime()

export const getToday = (): Date => new Date()

export const getRandomDateBetween = (from: Date, to: Date): Date => {
  const fromTime = from.getTime()
  const toTime = to.getTime()

  const randomTime =
    fromTime + Math.random() * (toTime - fromTime)

  return new Date(randomTime)
}

export const dateToHumanString = (d: Date): string => d.toLocaleString()
// #endregion

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
      name: "MIND",
      value: m.mind,
    },
    {
      name: "BODY",
      value: m.body,
    },
    {
      name: "WORK",
      value: m.work,
    },
    {
      name: "CASH",
      value: m.cash,
    },
    {
      name: "BOND",
      value: m.bond,
    },
  ]
}

export const getMetricScore = (n: string): number => {
  return 69
}