import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

export class OrderModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('orders')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting orders.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('orders')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('orders')
      const result = await collection.findOne({
        orderNumber: +code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('orders')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating order.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('orders')
      const { deletedCount } = await collection.deleteOne({ orderNumber: +id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting order.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('orders')
      const result = await collection.findOneAndUpdate(
        { orderNumber: +id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating orders.')
    }
  }

  static async getAllComplete ({ customerNumber }) {
    try {
      const db = await connectMongoDB('orders')

      const pipeline = []
      if (customerNumber !== undefined) {
        pipeline.push({
          $match: {
            customerNumber: +customerNumber
          }
        })
      }

      pipeline.push(
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
            from: 'orderstatus',
            localField: 'status',
            foreignField: 'id',
            as: 'ordersDetails'
          }
        },
        {
          $unwind: '$ordersDetails'
        },
        // {
        //   $lookup: {
        //     from: 'paymentmethods',
        //     localField: 'paymentMethod',
        //     foreignField: 'id',
        //     as: 'paymentMethodsDetails'
        //   }
        // },
        // {
        //   $unwind: '$paymentMethodsDetails'
        // },
        {
          $project: {
            _id: 0,
            orderNumber: 1,
            orderDate: 1,
            requiredDate: 1,
            comments: 1,
            total: 1,
            customerName: '$customerDetails.customerName',
            title: '$ordersDetails.title'
          }
        }
      )

      const orderDetails = await db.aggregate(pipeline).toArray()
      if (orderDetails.length === 0) return []

      //   const orderedDetails = orderDetails.map(detail => ({
      //     orderNumber: detail.orderNumber,
      //     productCode: detail.productCode,
      //     productName: detail.productName,
      //     quantityOrdered: detail.quantityOrdered,
      //     buyPrice: detail.buyPrice,
      //     orderLineNumber: detail.orderLineNumber,
      //     productImage: detail.productImage
      //   }))

      return orderDetails
    } catch (error) {
      throw new MongoDBError(error, 'Error getting order details.')
    }
  }

  static async updateAllDates ({ qtyDate, stringDate }) {
    try {
      const collection = await connectMongoDB('orders')
      const orders = await collection.find({}).toArray()
      let totalUpdatedCount = 0
      for (const order of orders) {
        const updatedFields = {}
        if (order.orderDate) {
          updatedFields.orderDate = dayjs(order.orderDate).add(+qtyDate, stringDate).toDate()
        }
        if (order.requiredDate) {
          updatedFields.requiredDate = dayjs(order.requiredDate).add(+qtyDate, stringDate).toDate()
        }
        if (order.pickUpDate) {
          updatedFields.pickUpDate = dayjs(order.pickUpDate).add(+qtyDate, stringDate).toDate()
        }
        const updateResult = await collection.updateOne(
          { _id: order._id },
          { $set: updatedFields }
        )
        totalUpdatedCount += updateResult.modifiedCount
      }

      return totalUpdatedCount
    } catch (error) {
      throw new MongoDBError(error, 'Error updating orders.')
    }
  }
}
