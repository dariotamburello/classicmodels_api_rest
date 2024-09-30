import { connectMongoDB } from '../../configuration/mongoConnections.js'
import { MongoDBError } from '../../utils/errorTypes.js'

export class ProductModel {
  static async getAll ({ productLine }) {
    try {
      const collection = await connectMongoDB('products')
      if (productLine) {
        return collection.find({
          productLine: +productLine
        }).toArray()
      }
      return collection.find({}).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product.')
    }
  }

  static async getLast () {
    try {
      const collection = await connectMongoDB('products')
      return collection.find().sort({ _id: -1 }).limit(1).toArray()
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product.')
    }
  }

  static async getById ({ id: idString }) {
    try {
      const collection = await connectMongoDB('products')
      const result = await collection.findOne({
        id: idString
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product.')
    }
  }

  static async getByCode (code) {
    try {
      const collection = await connectMongoDB('products')
      const result = await collection.findOne({
        productCode: code
      })
      return result ? [result] : []
    } catch (error) {
      throw new MongoDBError(error, 'Error getting product.')
    }
  }

  static async create (input) {
    try {
      const db = await connectMongoDB('products')
      const { insertedId } = await db.insertOne(input)
      return {
        id: insertedId,
        ...input
      }
    } catch (error) {
      throw new MongoDBError(error, 'Error creating product.')
    }
  }

  static async delete (id) {
    try {
      const collection = await connectMongoDB('products')
      const { deletedCount } = await collection.deleteOne({ id })
      return deletedCount > 0
    } catch (error) {
      throw new MongoDBError(error, 'Error deleting product.')
    }
  }

  static async update (id, input) {
    try {
      const collection = await connectMongoDB('products')
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: input },
        { returnDocument: 'after' }
      )
      if (!result) return false
      return result
    } catch (error) {
      throw new MongoDBError(error, 'Error updating product.')
    }
  }

  static async getAllComplete () {
    try {
      const collection = await connectMongoDB('products') // Conectamos a la colección 'products'

      const products = await collection.aggregate([
        {
          $lookup: {
            from: 'productlines', // Nombre de la colección con la que haces el join
            localField: 'productLine', // Campo en 'products' que sirve para relacionar
            foreignField: 'id', // Campo en 'productlines' que se corresponde con 'productLine'
            as: 'productline_info' // Nombre del nuevo campo donde se almacenará la información relacionada
          }
        },
        {
          $unwind: '$productline_info' // Descompone el array 'productline_info' en documentos individuales
        },
        {
          $project: {
            id: 1, // Seleccionas los campos que deseas en el resultado
            productCode: 1,
            productName: 1,
            productDescription: 1,
            buyPrice: 1,
            title: '$productline_info.title'
          }
        }
      ]).toArray()

      if (products.length === 0) return []
      return products
    } catch (error) {
      throw new MongoDBError(error, 'Error getting products.')
    }
  }
}
