import { Dayjs } from "dayjs"
import { Action } from "@/app/types"
import { convertTimestampToDayJS, isDateBetween } from "../dateTime"

const filterActionsByRange = (actions: Action[], from: Dayjs, to: Dayjs ): Action[] =>
  actions.filter(a => isDateBetween(convertTimestampToDayJS(a.timestamp), from, to))

export default filterActionsByRange