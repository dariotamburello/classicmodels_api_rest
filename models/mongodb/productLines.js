import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class ProductLineModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('productlines')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product lines.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('productlines')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product line.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('productlines')
      const result = await collection.findOne({
        id: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product line.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('productlines')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating product line.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('productlines')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting product line.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('productlines')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating product line.')
    }
  }
}
