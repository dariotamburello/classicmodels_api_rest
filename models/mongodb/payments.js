import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class PaymentsModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('payments')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting all payments.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('payments')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payment.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('payments')
      const result = await collection.findOne({
        checkNumber: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payment.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('payments')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating payment.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('payments')
      const { deletedCount } = await collection.deleteOne({ checkNumber: id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting payment.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('payments')
      const result = await collection.findOneAndUpdate(
        { checkNumber: id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating payment.')
    }
  }

  static async getAllComplete () {
    try {
      const db = await connectMongoDB('payments')

      const payments = await db.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'customerNumber',
            foreignField: 'customerNumber',
            as: 'customerDetails'
          }
        },
        {
          $unwind: '$customerDetails'
        },
        {
          $lookup: {
            from: 'paymentstatus',
            localField: 'paymentStatus',
            foreignField: 'id',
            as: 'statusDetails'
          }
        },
        {
          $unwind: '$statusDetails'
        },
        {
          $lookup: {
            from: 'paymentmethods',
            localField: 'paymentMethod',
            foreignField: 'id',
            as: 'methodDetails'
          }
        },
        {
          $unwind: '$methodDetails'
        },
        {
          $project: {
            checkNumber: 1,
            customerName: '$customerDetails.customerName',
            paymentDate: 1,
            amount: 1,
            title: '$statusDetails.title',
            type: '$methodDetails.type'
          }
        }
      ]).toArray()

      if (payments.length === 0) return []

      return payments
    } catch (error) {
      throw new MongoDBError(error, 'Error getting payments.')
    }
  }
}
