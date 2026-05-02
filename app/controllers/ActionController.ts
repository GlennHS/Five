import { db } from "../db"
import { toDay } from "../lib/dateTime"
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
  },

  async calculateStreak() {
    const timestamps = await db.actions
      .where('timestamp')
      .above(0) // or some safe lower bound
      .reverse()
      .limit(10000) // safety cap
      .toArray()
    
    if (timestamps.length === 0) return 0

    const days = new Set(timestamps.map(a => toDay(a.timestamp)))

    let streak = 0
    let currentDay = toDay(Date.now())

    if (days.has(currentDay)) streak++
    while (days.has(currentDay - 1)) {
      streak++
      currentDay--
    }


    return streak
  }
}