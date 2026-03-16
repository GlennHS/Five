import dayjs from 'dayjs'

import { Action, ActionDefinition, MetricSnapshotHistory } from "../types";
import { generateHistoryFromActionDefinitions } from "../utils/factories";
import { getToday } from '../utils/dateTime';

export const metricSnapshots: Partial<MetricSnapshotHistory> = {
  day: {
    timestamp: new Date().getTime(),
    mind: 80,
    body: 70,
    cash: 45,
    work: 23,
    bond: 34,
  },
}

export const actionDefinitions: ActionDefinition[] = [
  {
    id: "000000-0000-0000-000000",
    name: "Have an early night",
    mind: 4,
    body: 4,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000001",
    name: "Drink a pint of water",
    body: 2,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000002",
    name: "Work on portfolio (1 hour)",
    mind: 2,
    work: 4,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000003",
    name: "Go clubbing",
    mind: -1,
    body: -4,
    bond: 3,
    tags: [
      'negative'
    ],
  },
  {
    id: "000000-0000-0000-000004",
    name: "Get a takeaway",
    body: -3,
    cash: -3,
    tags: [
      'negative'
    ],
  },

  {
    id: "000000-0000-0000-000005",
    name: "Go for a walk",
    mind: 2,
    body: 2,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000006",
    name: "Go to the gym",
    mind: 2,
    body: 5,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000007",
    name: "Cook a healthy meal",
    body: 3,
    cash: 1,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000008",
    name: "Meditate",
    mind: 4,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000009",
    name: "Read a book",
    mind: 3,
    tags: [
      'positive'
    ],
  },

  {
    id: "000000-0000-0000-000010",
    name: "Call a friend",
    mind: 2,
    bond: 4,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000011",
    name: "Go for a coffee with someone",
    bond: 4,
    cash: -1,
  },
  {
    id: "000000-0000-0000-000012",
    name: "Help someone out",
    mind: 2,
    bond: 3,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000013",
    name: "Go on a date",
    bond: 5,
    cash: -2,
  },

  {
    id: "000000-0000-0000-000014",
    name: "Deep work session (2 hours)",
    mind: 2,
    work: 5,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000015",
    name: "Learn something new",
    mind: 4,
    work: 2,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000016",
    name: "Plan the week",
    mind: 2,
    work: 3,
    tags: [
      'positive'
    ],
  },

  {
    id: "000000-0000-0000-000017",
    name: "Buy something nice",
    mind: 2,
    cash: -4,
  },
  {
    id: "000000-0000-0000-000018",
    name: "Impulse online shopping",
    mind: -2,
    cash: -5,
    tags: [
      'negative'
    ],
  },
  {
    id: "000000-0000-0000-000019",
    name: "Put money into savings",
    mind: 2,
    cash: 4,
    tags: [
      'positive'
    ],
  },

  {
    id: "000000-0000-0000-000020",
    name: "Scroll social media for an hour",
    mind: -3,
    body: -1,
    tags: [
      'negative'
    ],
  },
  {
    id: "000000-0000-0000-000021",
    name: "Binge watch TV late",
    mind: -2,
    body: -2,
    tags: [
      'negative'
    ],
  },
  {
    id: "000000-0000-0000-000022",
    name: "Play video games",
    mind: 1,
    body: -1,
    tags: [
      'negative'
    ],
  },

  {
    id: "000000-0000-0000-000023",
    name: "Clean the house",
    mind: 2,
    body: 2,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000024",
    name: "Do the laundry",
    mind: 1,
    body: 1,
    tags: [
      'positive'
    ],
  },
  {
    id: "000000-0000-0000-000025",
    name: "Tidy workspace",
    mind: 2,
    work: 2,
    tags: [
      'positive'
    ],
  }
]

const getActionHistory = (): Action[] =>
  generateHistoryFromActionDefinitions(
    actionDefinitions,
    50,
    getToday(),
    dayjs(getToday()).subtract(14, "days")
  )
  
export const actionHistory = getActionHistory()