import { db } from "../db"
import { ActionDefinitionDB } from "../types"

export const ActionDefinitionController = {
  async create(def: Omit<ActionDefinitionDB, "id">) {
    return db.actionDefinitions.add(def)
  },

  async get(id: number) {
    return db.actionDefinitions.get(id)
  },

  async getAll() {
    return db.actionDefinitions.toArray()
  },

  async update(def: ActionDefinitionDB) {
    console.log(JSON.stringify(def))
    return db.actionDefinitions.put(def)
  },

  async delete(id: number) {
    return db.actionDefinitions.delete(id)
  },
}