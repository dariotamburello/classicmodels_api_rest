// const collection = await connectMongoDB('????')
// import { LogsModel as mysqlModel } from '../mysql/logs.js'
// const rows = await mysqlModel.getAll('')
// if (rows.length > 0) {
//   await collection.insertMany(rows)
//   console.log('Datos migrados exitosamente a MongoDB')
// } else {
//   console.log('No hay datos para migrar')
// }

import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class LogsModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('logs')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting logs.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('logs')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting log.')
    }
  }

  static async getById ({ id: logId }) {
    try {
      const collection = await connectMongoDB('logs')
      const result = await collection.findOne({
        id: logId
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting log.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('logs')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating log.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('logs')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting log.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('logs')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating logs.')
    }
  }
}
