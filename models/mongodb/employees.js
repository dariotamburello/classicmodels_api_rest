import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class EmployeeModel {
  static async getAll ({ officeCode }) {
    try {
      const collection = await connectMongoDB('employees')
      if (officeCode) {
        return collection.find({
          officeCode: +officeCode
        }).toArray()
      }
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting employees.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('employees')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting employee.')
    }
  }

  static async getById ({ id: customer }) {
    try {
      const collection = await connectMongoDB('employees')
      const result = await collection.findOne({
        employeeNumber: +customer
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting employee.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('employees')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating employee.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('employees')
      const { deletedCount } = await collection.deleteOne({ employeeNumber: +id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting employee.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('employees')
      const result = await collection.findOneAndUpdate(
        { employeeNumber: +id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating employee.')
    }
  }
}
