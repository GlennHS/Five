import dayjs, { Dayjs } from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import isBetween from "dayjs/plugin/isBetween"
import isoWeek from "dayjs/plugin/isoWeek"

dayjs.extend(advancedFormat)
dayjs.extend(isBetween)
dayjs.extend(isoWeek)

export const convertTimestampToDayJS = (ts: number): Dayjs => dayjs(ts)
export const convertDayJSToTimestamp = (d: Dayjs): number => d.valueOf()
export const DateToTimestamp = (d: Date): number => d.getTime()

export const isDateBetween = (date: Dayjs, from: Dayjs, to: Dayjs): boolean => date.isBetween(from, to)

export const getToday = (): Dayjs => dayjs()
export const getAWeekAgo = (): Dayjs => dayjs().subtract(6, 'days')

export const getRandomDateBetween = (from: Dayjs, to: Dayjs): Dayjs => {
  const fromTime = from.valueOf()
  const toTime = to.valueOf()

  const randomTime =
    fromTime + Math.random() * (toTime - fromTime)

  console.log(dayjs(from).toISOString())
  console.log(dayjs(to).toISOString())
  console.log(dayjs(randomTime).toISOString())

  return dayjs(randomTime)
}

export const formatSmartDate = (d: Dayjs): string => {
  const now = dayjs()

  if (d.isSame(now, "day")) {
    return d.format("h:mma")
  }

  if (d.isSame(now, "week")) {
    return d.format("ddd h:mma")
  }

  if (d.isSame(now, "month")) {
    return d.format("Do h:mma")
  }

  if (d.isSame(now, "year")) {
    return d.format("Do MMM h:mma")
  }

  return d.format("Do MMM YYYY h:mma")
}

export const dateToHumanString = (d: Date): string => d.toLocaleString()
export const getDaysSinceDate = (from: Dayjs, to: Dayjs = getToday()): number => Math.abs(from.diff(to, 'day'))
