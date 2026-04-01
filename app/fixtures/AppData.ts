import dayjs from 'dayjs'

import { Action, ActionDefinition, MetricSnapshotHistory, Tag } from "../types";
import { generateHistoryFromActionDefinitions } from "../utils/factories";
import { getToday } from '../utils/dateTime';

const positiveTag: Tag = {
  id: 0,
  name: 'positive',
  colorKey: 'green',
}

const negativeTag: Tag = {
  id: 1,
  name: 'negative',
  colorKey: 'red',
}

const importantTag: Tag = {
  id: 2,
  name: 'important',
  colorKey: 'yellow',
}

const otherTag: Tag = {
  id: 3,
  name: 'other',
  colorKey: 'blue',
}

export const tags = [
  positiveTag,
  negativeTag,
  importantTag,
  otherTag,
]

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
    id: 0,
    name: "Have an early night",
    mind: 4,
    body: 4,
    tags: [
      positiveTag,
      importantTag,
      negativeTag,
      otherTag,
    ],
    archived: false,
  },
  {
    id: 1,
    name: "Drink a pint of water",
    body: 2,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 2,
    name: "Work on portfolio (1 hour)",
    mind: 2,
    work: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 3,
    name: "Go clubbing",
    mind: -1,
    body: -4,
    bond: 3,
    tags: [
      negativeTag
    ],
    archived: false,
  },
  {
    id: 4,
    name: "Get a takeaway",
    body: -3,
    cash: -3,
    tags: [
      negativeTag
    ],
    archived: false,
  },

  {
    id: 5,
    name: "Go for a walk",
    mind: 2,
    body: 2,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 6,
    name: "Go to the gym",
    mind: 2,
    body: 5,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 7,
    name: "Cook a healthy meal",
    body: 3,
    cash: 1,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 8,
    name: "Meditate",
    mind: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 9,
    name: "Read a book",
    mind: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },

  {
    id: 10,
    name: "Call a friend",
    mind: 2,
    bond: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 11,
    name: "Go for a coffee with someone",
    bond: 4,
    cash: -1,
    tags: [],
    archived: false,
  },
  {
    id: 12,
    name: "Help someone out",
    mind: 2,
    bond: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 13,
    name: "Go on a date",
    bond: 5,
    cash: -2,
    tags: [],
    archived: false,
  },

  {
    id: 14,
    name: "Deep work session (2 hours)",
    mind: 2,
    work: 5,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 15,
    name: "Learn something new",
    mind: 4,
    work: 2,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 16,
    name: "Plan the week",
    mind: 2,
    work: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },

  {
    id: 17,
    name: "Buy something nice",
    mind: 2,
    cash: -4,
    tags: [],
    archived: false,
  },
  {
    id: 18,
    name: "Impulse online shopping",
    mind: -2,
    cash: -5,
    tags: [
      negativeTag
    ],
    archived: false,
  },
  {
    id: 19,
    name: "Put money into savings",
    mind: 2,
    cash: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },

  {
    id: 20,
    name: "Scroll social media for an hour",
    mind: -3,
    body: -1,
    tags: [
      negativeTag
    ],
    archived: false,
  },
  {
    id: 21,
    name: "Binge watch TV late",
    mind: -2,
    body: -2,
    tags: [
      negativeTag
    ],
    archived: false,
  },
  {
    id: 22,
    name: "Play video games",
    mind: 1,
    body: -1,
    tags: [
      negativeTag
    ],
    archived: false,
  },

  {
    id: 23,
    name: "Clean the house",
    mind: 2,
    body: 2,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 24,
    name: "Do the laundry",
    mind: 1,
    body: 1,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 25,
    name: "Tidy workspace",
    mind: 2,
    work: 2,
    tags: [
      positiveTag
    ],
    archived: false,
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