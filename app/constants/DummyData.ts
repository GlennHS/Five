import { ActionDefinition, Tag } from "../types";

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

const relaxingTag: Tag = {
  id: 3,
  name: 'relaxing',
  colorKey: 'blue',
}

export const tags = [
  positiveTag,
  negativeTag,
  importantTag,
  relaxingTag,
]

export const actionDefinitions: ActionDefinition[] = [
  {
    id: 0,
    name: "Have an early night",
    favourite: false,
    mind: 4,
    body: 4,
    tags: [
      positiveTag,
      relaxingTag,
    ],
    archived: false,
  },
  {
    id: 1,
    name: "Drink a pint of water",
    favourite: false,
    body: 2,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 2,
    name: "Work on a personal project (1 hour)",
    favourite: false,
    mind: 2,
    work: 5,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 3,
    name: "Go out with friends",
    favourite: false,
    mind: 1,
    body: 2,
    cash: -2,
    bond: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 4,
    name: "Get a takeaway",
    favourite: false,
    body: -3,
    cash: -2,
    tags: [
      negativeTag
    ],
    archived: false,
  },

  {
    id: 5,
    name: "Go for a walk",
    favourite: false,
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
    favourite: false,
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
    favourite: false,
    body: 3,
    mind: 1,
    cash: 1,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 8,
    name: "Meditate",
    favourite: false,
    mind: 4,
    tags: [
      positiveTag,
      relaxingTag,
    ],
    archived: false,
  },
  {
    id: 9,
    name: "Read a book",
    favourite: false,
    mind: 3,
    tags: [
      positiveTag,
      relaxingTag,
    ],
    archived: false,
  },

  {
    id: 10,
    name: "Call a friend",
    favourite: false,
    mind: 2,
    bond: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 11,
    name: "Go for a coffee with someone",
    favourite: false,
    bond: 4,
    cash: -1,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 12,
    name: "Help a friend out",
    favourite: false,
    mind: 1,
    bond: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 14,
    name: "Deep work session (2 hours)",
    favourite: false,
    mind: 2,
    work: 7,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 15,
    name: "Learn something new",
    favourite: false,
    mind: 4,
    work: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 16,
    name: "Plan the week",
    favourite: false,
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
    favourite: false,
    mind: 2,
    cash: -4,
    tags: [],
    archived: false,
  },
  {
    id: 18,
    name: "Impulse online shopping",
    favourite: false,
    mind: -2,
    cash: -3,
    tags: [
      negativeTag
    ],
    archived: false,
  },
  {
    id: 19,
    name: "Put a little into savings",
    favourite: false,
    mind: 2,
    cash: 4,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 26,
    name: "Put some money into savings",
    favourite: false,
    mind: 3,
    cash: 8,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 27,
    name: "Put a lot into savings",
    favourite: false,
    mind: 4,
    cash: 12,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 20,
    name: "Scroll social media for an hour",
    favourite: false,
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
    favourite: false,
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
    favourite: false,
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
    favourite: false,
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
    favourite: false,
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
    favourite: false,
    mind: 3,
    work: 3,
    tags: [
      positiveTag
    ],
    archived: false,
  },
  {
    id: 28,
    name: "Spend nothing today",
    favourite: false,
    mind: 2,
    cash: 8,
    tags: [
      positiveTag
    ],
    archived: false,
  }
]
