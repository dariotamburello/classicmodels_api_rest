import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'
import { DBError } from '../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class ProductLineModel {
  static async getAll () {
    try {
      const [productLines] = await connection.query(
        'SELECT * FROM productLines;'
      )
      if (productLines.length === 0) return []
      return productLines
    } catch (error) {
      throw new DBError(error, 'Error getting product lines.')
    }
  }

  static async getById ({ id }) {
    try {
      const productLine = await connection.query(
        'SELECT * FROM productLines WHERE id = ?;',
        [id]
      )
      if (!productLine) return []
      return productLine[0]
    } catch (error) {
      throw new DBError(error, 'Error getting products line.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        title,
        description
      } = input

      const existProductLine = await this.getById({ id })
      if (existProductLine.length > 0) return false

      await connection.query(
        `INSERT INTO productLines (id, title, description)
        VALUES (?, ?, ?);`,
        [id, title, description]
      )
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating products line.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM productLines WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting products line.')
    }
  }

  static async update (id, input) {
    try {
      const existProductLine = await this.getById({ id })
      if (existProductLine.length === 0) return false

      const newProductLine = {
        title: input.title ?? existProductLine[0].title,
        description: input.description ?? existProductLine[0].description
      }

      await connection.query(
        `UPDATE productLines 
        SET title = ?, description = ?
        WHERE id = ? ;`,
        [
          newProductLine.title, newProductLine.description, id
        ]
      )

      return { newProductLine }
    } catch (error) {
      throw new DBError(error, 'Error updating product line.')
    }
  }
}
