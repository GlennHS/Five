import dayjs, { Dayjs } from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isoWeek)
dayjs.extend(isBetween)

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

export const dateToHumanString = (d: Date): string => d.toLocaleString()
