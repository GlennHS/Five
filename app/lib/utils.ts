export const toSentenceCase = (s: string) : string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

export const pickRandom = <T>(a: T[]): T => {
  return a[Math.floor(Math.random() * a.length)]
}

export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function waitForElement(selector: string) {
  return new Promise<void>((resolve) => {
    const el = document.querySelector(selector)
    if (el) return resolve()

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect()
        resolve()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}
