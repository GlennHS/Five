import { Action, ActionDefinition, ActionDetails } from "@/app/types"

const getActionDetails = (
  action: Action,
  defs: ActionDefinition[]
): ActionDetails | null => {

  const def = defs.find(d => d.id === action.actionId)
  if (!def) return null

  return {
    id: action.id,
    name: def.name,
    tags: def.tags ?? [],
    timestamp: action.timestamp,
    note: action.note,
    metrics: {
      mind: def.mind ?? 0,
      body: def.body ?? 0,
      work: def.work ?? 0,
      cash: def.cash ?? 0,
      bond: def.bond ?? 0
    }
  }
}

export default getActionDetails
