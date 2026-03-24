// db.ts
import { Dexie, type EntityTable } from "dexie"
import { ActionDefinitionDB, TagDB } from "./types"
import { actionDefinitions, tags } from "./fixtures/AppData"

const db = new Dexie("Main") as Dexie & {
  tags: EntityTable<
    TagDB,
    "id" // primary key "id" (for the typings only)
  >
  actionDefinitions: EntityTable<
    ActionDefinitionDB,
    "id" // primary key "id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  tags: "++id, name, colorKey", // primary key "id" (for the runtime!)
  actionDefinitions: "++id, name, *tagIds"
})

db.on("populate", async () => {
  const tagIdMap = new Map<string, number>()

  // 1. Insert tags
  for (const tag of tags) {
    const id = await db.tags.add({
      name: tag.name,
      colorKey: tag.colorKey
    })

    tagIdMap.set(tag.name, id)
  }

  // 2. Insert action definitions
  for (const def of actionDefinitions) {
    const tagIds =
      def.tags?.map(t => tagIdMap.get(t.name)!).filter(Boolean) ?? []

    await db.actionDefinitions.add({
      name: def.name,
      tagIds,
      mind: def.mind ?? 0,
      body: def.body ?? 0,
      work: def.work ?? 0,
      cash: def.cash ?? 0,
      bond: def.bond ?? 0
    })
  }
})

export { db }
