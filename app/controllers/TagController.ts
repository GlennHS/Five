import { db } from "../db"
import { TAG_COLOR_CLASSES } from "../constants/Colors"
import { TagDB } from "../types"

export const TagController = {
  async create(name: string, colorKey: keyof typeof TAG_COLOR_CLASSES) {
    return db.tags.add({ name, colorKey })
  },

  async getAll() {
    return db.tags.toArray()
  },

  async delete(id: number) {
    return db.tags.delete(id)
  },

  async update(tag: TagDB) {
    return db.tags.put(tag)
  }
}