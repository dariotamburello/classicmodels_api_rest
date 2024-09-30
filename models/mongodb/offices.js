import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class OfficeModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('offices')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting offices.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('offices')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting office.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('offices')
      const result = await collection.findOne({
        id: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting office.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('offices')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating office.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('offices')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting office.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('offices')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating offices.')
    }
  }
}
