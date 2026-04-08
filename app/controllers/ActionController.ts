import { db } from "../db"
import { ActionDB } from "../types"

export const ActionController = {
  async create(def: Omit<ActionDB, "id">) {
    return db.actions.add(def)
  },

  async get(id: number) {
    return db.actions.get(id)
  },

  async getAllYear() {
    const oneYearAgo = Date.now() - 1000 * 60 * 60 * 24 * 365

    const recentActions = await db.actions
      .where('timestamp')
      .above(oneYearAgo)
      .reverse()
      .limit(500)
      .toArray()
    
      return recentActions
  },

  async getAll() {
    return db.actions.toArray()
  },

  async update(def: ActionDB) {
    return db.actions.put(def)
  },

  async delete(id: number) {
    return db.actions.delete(id)
  }
}