export const createRandomMetric = (min: number = 30, max: number = 80): number => Math.floor(Math.random() * (max - min) + min)

export const createRandomFive = (min: number = 30, max: number = 80): number[] => {
  return [0,0,0,0,0,0].map(() => createRandomMetric(min, max))
}