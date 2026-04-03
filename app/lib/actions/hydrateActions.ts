import { Action, ActionDB } from "@/app/types"

function hydrateActions(
  defs: ActionDB[],
): Action[] {
    return defs.map(d => {
      return {
        ...d
      }
    })
}

export default hydrateActions
