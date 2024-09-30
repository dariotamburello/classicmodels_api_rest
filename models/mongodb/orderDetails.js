import { connectMongoDB, connectMongoDBandClient } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class OrderDetailsModel {
  static async getAll ({ orderNumber }) {
    try {
      const collection = await connectMongoDB('orderdetails')
      if (orderNumber) {
        return collection.find({
          orderNumber: +orderNumber
        }).sort({ orderLineNumber: 1 }).toArray()
      }
      return collection.find({}).sort({ orderLineNumber: 1 }).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting all order details.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('orderdetails')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order details.')
    }
  }

  static async getById ({ orderNumber, orderLineNumber }) {
    try {
      const collection = await connectMongoDB('orderdetails')
      const result = await collection.find({
        orderNumber: +orderNumber,
        orderLineNumber: +orderLineNumber
      }).toArray()
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order details.')
    }
  }

  static async create (input) {
    const client = await connectMongoDBandClient()
    const session = client.startSession()
    try {
      session.startTransaction()
      const db = await connectMongoDB('orderdetails')
      for (const detail of input) {
        await db.insertOne(detail, { session })
      }
      await session.commitTransaction()
      return input
    } catch (error) {
      await session.abortTransaction()
      throw new MongoDBError(error, 'Error creating order details.')
    } finally {
      session.endSession()
    }
  }

  static async delete ({ orderNumber, orderLineNumber }) {
    try {
      const collection = await connectMongoDB('orderdetails')
      const { deletedCount } = await collection.deleteOne(
        {
          orderNumber: +orderNumber,
          orderLineNumber: +orderLineNumber
        }
      )
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting order details.')
    }
  }

  static async update ({ orderNumber }, orderLineNumber, input) {
    try {
      const collection = await connectMongoDB('orderdetails')
      const result = await collection.findOneAndUpdate(
        { orderNumber: +orderNumber, orderLineNumber: +orderLineNumber },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating order details.')
    }
  }

  static async getAllComplete ({ orderNumber }) {
    try {
      const db = await connectMongoDB('orderdetails')

      const pipeline = []
      if (orderNumber !== undefined) {
        pipeline.push({
          $match: {
            orderNumber: +orderNumber
          }
        })
      }
      pipeline.push(
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: 'id',
            as: 'productDetails'
          }
        },
        {
          $unwind: '$productDetails'
        },
        {
          $project: {
            _id: 0,
            orderNumber: 1,
            productCode: '$productDetails.productCode',
            productName: '$productDetails.productName',
            productId: 1,
            quantityOrdered: 1,
            buyPrice: '$productDetails.buyPrice',
            orderLineNumber: 1,
            productImage: '$productDetails.productImage'
          }
        }
      )

      const orderDetails = await db.aggregate(pipeline).toArray()
      if (orderDetails.length === 0) return []

      const orderedDetails = orderDetails.map(detail => ({
        productId: detail.productId,
        orderNumber: detail.orderNumber,
        productCode: detail.productCode,
        productName: detail.productName,
        quantityOrdered: detail.quantityOrdered,
        buyPrice: detail.buyPrice,
        orderLineNumber: detail.orderLineNumber,
        productImage: detail.productImage
      }))

      return orderedDetails
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order details.')
    }
  }
}
