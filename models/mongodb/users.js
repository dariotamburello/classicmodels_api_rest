import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class UsersModel {
  static async getAll () {
    try {
      const collection = await connectMongoDB('users')
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting all user.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('users')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting user.')
    }
  }

  static async getById ({ id: code }) {
    try {
      const collection = await connectMongoDB('users')
      const result = await collection.findOne({
        id: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting user.')
    }
  }

  static async getByUsername (id) {
    try {
      const collection = await connectMongoDB('users')
      const result = await collection.findOne({
        username: id
      })
      return result || false
    } catch (error) {
      throw new MongoDBError(error, 'Error getting user.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('users')
      const { hashedPassword, ...rest } = input
      const newUser = {
        ...rest,
        password: hashedPassword
      }
      const { insertedId } = await db.insertOne(newUser)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating user.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('users')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting user.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('users')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating user.')
    }
  }
}
