import { ActionDefinition } from "@/app/types"

const buildActionMap = (
  defs: ActionDefinition[]
): Record<string, ActionDefinition> =>
  Object.fromEntries(defs.map(d => [d.id, d]))

export default buildActionMap