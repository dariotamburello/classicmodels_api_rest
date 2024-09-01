import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'
import { DBError } from '../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class OrderStatusModel {
  static async getAll () {
    try {
      const [orderStatus] = await connection.query(
        'SELECT * FROM orderStatus;'
      )
      if (orderStatus.length === 0) return []
      return orderStatus
    } catch (error) {
      throw new DBError(error, 'Error getting order status.')
    }
  }

  static async getById ({ id }) {
    try {
      const orderStatus = await connection.query(
        'SELECT * FROM orderStatus WHERE id = ?;',
        [id]
      )
      if (!orderStatus) return []
      return orderStatus[0]
    } catch (error) {
      throw new DBError(error, 'Error getting order status.')
    }
  }

  static async create (input) {
    try {
      const {
        title,
        description
      } = input

      const result = await connection.query(
        `INSERT INTO orderStatus (
            title,
            description
        ) VALUES (?, ?);`,
        [
          title,
          description
        ]
      )
      input.statusId = result[0].insertId
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating order status.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM orderStatus WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting order status.')
    }
  }

  static async update (id, input) {
    try {
      const existOrderStatus = await this.getById({ id })
      if (existOrderStatus.length === 0) return false

      const orderStatusComplete = {
        title: input.title ?? existOrderStatus[0].title,
        description: input.description ?? existOrderStatus[0].description
      }

      await connection.query(
        `UPDATE orderStatus
        SET title = ?,
            description = ?
        WHERE id = ?;`,
        [
          orderStatusComplete.title,
          orderStatusComplete.description,
          id
        ]
      )
      return orderStatusComplete
    } catch (error) {
      throw new DBError(error, 'Error updating order status.')
    }
  }
}
