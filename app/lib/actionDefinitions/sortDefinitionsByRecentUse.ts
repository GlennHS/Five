import { Action, ActionDefinitionDB } from "@/app/types"

function sortDefinitionsByRecentUse(
  defs: ActionDefinitionDB[],
  actions: Action[]
) {
  const latestMap = new Map<number, number>()

  for (const action of actions) {
    const current = latestMap.get(action.actionId)

    if (!current || action.timestamp > current) {
      latestMap.set(action.actionId, action.timestamp)
    }
  }

  return [...defs].sort((a, b) => {
    const aTime = latestMap.get(a.id!) ?? 0
    const bTime = latestMap.get(b.id!) ?? 0

    return bTime - aTime // newest first
  })
}

export default sortDefinitionsByRecentUse
