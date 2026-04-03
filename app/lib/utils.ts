export const toSentenceCase = (s: string) : string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

export const pickRandom = <T>(a: T[]): T => {
  return a[Math.floor(Math.random() * a.length)]
}
