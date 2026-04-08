// db.ts
import { Dexie, InsertType, type EntityTable } from "dexie"
import { ActionDB, ActionDefinitionDB, TagDB } from "./types"
import { actionDefinitions, tags } from "./fixtures/DummyData"
import { pickRandom } from "./lib/utils"

const SIMULATE_LOG_TYPE = "random" // good, bad, random, empty
const QUANTITY = 50000

const db = new Dexie("Main") as Dexie & {
  tags: EntityTable<
    TagDB,
    "id" // primary key "id" (for the typings only)
  >
  actionDefinitions: EntityTable<
    ActionDefinitionDB,
    "id" // primary key "id" (for the typings only)
  >
  actions: EntityTable<
    ActionDB,
    "id" // primary key "id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  tags: "++id, name, colorKey", // primary key "id" (for the runtime!)
  actionDefinitions: "++id, name, *tagIds",
  actions: "++id, name, actionId, timestamp",
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
  // Somehow these get inserted in the correct order and that scares me slightly.
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
      bond: def.bond ?? 0,
      archived: false,
    })
  }
  
  const defs = await db.actionDefinitions.toArray()
  const actionsToInsert: InsertType<ActionDB, 'id'>[] = []
  let actionIDs = []
  const now = Date.now()
  let startOfLogs = now

  switch (SIMULATE_LOG_TYPE) {
    case "random":
      startOfLogs = now - 1000 * 60 * 60 * 24 * 30 * 12 * 20

      for (let i = 0; i < QUANTITY; i++) {
        const def = pickRandom(defs)
    
        actionsToInsert.push({
          actionId: def.id!,
          timestamp:
            startOfLogs + Math.random() * (now - startOfLogs),
          note: "Test Data"
        })
      }
      break;
    case "good":
      startOfLogs = now - 1000 * 60 * 60 * 24 * 7
      actionIDs = [
        0, 1, 1, 1, 2, 3, 5, 8, 9, 28,
        0, 1, 1, 1, 2, 3, 6, 7, 9,
        0, 1, 1, 1, 2, 3, 28,
        0, 1, 2, 3, 5, 6, 8, 9, 10, 14,
        0, 1, 1, 2, 3, 7,
        0, 1, 1, 1, 3, 14, 28,
        0, 1, 1, 1, 2, 3, 5, 7, 8, 16,
      ]

      actionIDs.forEach(id => {
        const action = defs.find(d => d.id === id + 1)
        if (action)
          actionsToInsert.push({
            actionId: action.id,
            timestamp:
              startOfLogs + Math.random() * (now - startOfLogs),
            note: "Test Data - Good"
          })
      })
      break;

    case "bad":
      startOfLogs = now - 1000 * 60 * 60 * 24 * 7
      actionIDs = [
        1, 21, 20, 20, 22, 12, 10, 5, 18,
        0, 1, 2, 3, 5, 6, 8, 9, 10, 14,
        1, 21, 20, 20, 22, 12, 10, 5, 18,
        1, 21, 20, 20, 22, 12, 10, 5, 18, 26,
        1, 21, 20, 20, 22, 12, 10, 5, 18,
        0, 1, 2, 3, 5, 6, 8, 9, 10, 14,
        1, 21, 20, 20, 22, 12, 10, 5, 18, 26,
      ]

      actionIDs.forEach(id => {
        const action = defs.find(d => d.id === id + 1)
        if (action)
          actionsToInsert.push({
            actionId: action.id,
            timestamp:
              startOfLogs + Math.random() * (now - startOfLogs),
            note: "Test Data - Bad"
          })
      })
      break;

    default:
      break;
  }

  await db.transaction('rw', db.actions, async () => {
    const CHUNK_SIZE = 200

    for (let i = 0; i < actionsToInsert.length; i += CHUNK_SIZE) {
      await db.actions.bulkAdd(actionsToInsert.slice(i, i + CHUNK_SIZE))
      console.log("Chunk Added")
    }
  })
})

// Expose DB in console for debugging
// if (typeof window !== "undefined") {
//   (window as any).db = db
// }

export { db }
