import { Action, ActionDefinition, FiveMetrics } from "../types"
import { DateToTimestamp, createRandomUUID, getRandomDateBetween, pickRandom } from "./helpers"

export const createRandomMetric = (min: number = 30, max: number = 80): number => Math.floor(Math.random() * (max - min) + min)

export const createRandomFive = (min: number = 30, max: number = 80): FiveMetrics => {
  return {
    mind: createRandomMetric(min, max),
    body: createRandomMetric(min, max),
    cash: createRandomMetric(min, max),
    work: createRandomMetric(min, max),
    bond: createRandomMetric(min, max),
  }
}

export const generateHistoryFromActionDefinitions = (
  definitions: ActionDefinition[],
  quantity: number,
  fromDate: Date,
  toDate: Date,
): Action[] => {
  const actions: Action[] = []
  for(let i = 0; i < quantity; i++) {
    const newAction: Action = {
      id: createRandomUUID(),
      actionId: pickRandom(definitions).id,
      timestamp: DateToTimestamp(getRandomDateBetween(fromDate, toDate)),
      note: "Test Data",
    }
    actions.push(newAction)
  }
  return actions
}