import { Action, ActionDefinition, FiveMetric } from "../types"
import { createRandomUUID, pickRandom } from "./helpers"
import { convertDayJSToTimestamp, getRandomDateBetween } from "./dateTime"
import { Dayjs } from "dayjs"

export const createRandomMetric = (min: number = 30, max: number = 80): number => Math.floor(Math.random() * (max - min) + min)

export const createRandomFive = (min: number = 30, max: number = 80): FiveMetric => {
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
  fromDate: Dayjs,
  toDate: Dayjs,
): Action[] => {
  const actions: Action[] = []
  for(let i = 0; i < quantity; i++) {
    const newAction: Action = {
      id: createRandomUUID(),
      actionId: pickRandom(definitions).id,
      timestamp: convertDayJSToTimestamp(getRandomDateBetween(fromDate, toDate)),
      note: "Test Data",
    }
    actions.push(newAction)
  }
  return actions
}