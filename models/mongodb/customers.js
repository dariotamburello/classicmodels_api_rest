import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class CustomerModel {
  static async getAll ({ salesRepEmployeeNumber }) {
    try {
      const collection = await connectMongoDB('customers')
      if (salesRepEmployeeNumber) {
        return collection.find({
          salesRepEmployeeNumber: +salesRepEmployeeNumber
        }).toArray()
      }
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting customers.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('customers')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting customer.')
    }
  }

  static async getById ({ id: customer }) {
    try {
      const collection = await connectMongoDB('customers')
      const result = await collection.findOne({
        customerNumber: +customer
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting customer.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('customers')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating customer.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('customers')
      const { deletedCount } = await collection.deleteOne({ customerNumber: +id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting customer.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('customers')
      const result = await collection.findOneAndUpdate(
        { customerNumber: +id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating customer.')
    }
  }
}
