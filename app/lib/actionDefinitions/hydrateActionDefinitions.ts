import { Tag, ActionDefinitionDB, TagDB, ActionDefinition } from "@/app/types"

function hydrateActionDefinitions(
  defs: ActionDefinitionDB[],
  tags: TagDB[]
): ActionDefinition[] {
  const tagMap = new Map(tags.map(t => [t.id, t]))

  return defs.map(def => {
    const hydratedTags = def.tagIds
      .map(id => tagMap.get(id))
      .filter(Boolean) as Tag[]

    return {
      id: def.id!,
      name: def.name,
      tags: hydratedTags.length > 0 ? hydratedTags : [],
      mind: def.mind,
      body: def.body,
      work: def.work,
      cash: def.cash,
      bond: def.bond,
      archived: def.archived,
    }
  })
}

export default hydrateActionDefinitions
