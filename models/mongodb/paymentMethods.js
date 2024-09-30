import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class PaymentMethodsModel {
  static async getAll () {
    try {
      console.log('getall')
      const collection = await connectMongoDB('paymentmethods')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments methods.')
    }
  }

  static async getAllActive () {
    try {
      const collection = await connectMongoDB('paymentmethods')
      const result = await collection.find({
        enabled: 1
      }).toArray()
      return result || false
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments methods.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('paymentmethods')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments methods.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('paymentmethods')
      const result = await collection.findOne({
        id: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments methods.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('paymentmethods')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating payments methods.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('paymentmethods')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting payments methods.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('paymentmethods')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating payments methods.')
    }
  }
}
