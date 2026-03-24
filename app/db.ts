// db.ts
import { Dexie, type EntityTable } from "dexie"
import { ActionDefinitionDB, TagDB } from "./types"
import { actionDefinitions } from "./fixtures/AppData"

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

export { db }
