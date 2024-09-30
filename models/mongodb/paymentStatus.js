import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class PaymentStatusModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('paymentstatus')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments status.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('paymentstatus')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments status.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('paymentstatus')
      const result = await collection.findOne({
        id: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments status.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('paymentstatus')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating payments status.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('paymentstatus')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting payments status.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('paymentstatus')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating payments status.')
    }
  }
}
