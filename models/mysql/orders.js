import mysql from 'mysql2/promise'
import { configuration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class OrderModel {
  static async getAll ({ customerNumber }) {
    try {
      const [orders] = await connection.query(
        'SELECT * FROM orders;'
      )
      if (orders.length === 0) return []
      if (customerNumber) return orders.filter(e => (e.customerNumber === +customerNumber))
      return orders
    } catch (error) {
      throw new DBError(error, 'Error getting orders.')
    }
  }

  static async getById ({ id }) {
    try {
      const order = await connection.query(
        'SELECT * FROM orders WHERE orderNumber = ?;',
        [id]
      )
      if (!order) return []
      return order[0]
    } catch (error) {
      throw new DBError(error, 'Error getting order.')
    }
  }

  static async create (order) {
    try {
      const {
        orderNumber,
        orderDate,
        requiredDate,
        pickUpDate,
        status,
        comments,
        customerNumber,
        total,
        paymentCheckNumber,
        pickUpOffice
      } = order

      // const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ') // Format YYYY-MM-DD HH:MM:SS

      await connection.query(
        `INSERT INTO orders (
            orderNumber,
            orderDate,
            requiredDate,
            pickUpDate,
            status,
            comments,
            customerNumber,
            total,
            paymentCheckNumber,
            pickUpOffice
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          orderNumber,
          orderDate,
          requiredDate,
          pickUpDate,
          status,
          comments,
          customerNumber,
          total,
          paymentCheckNumber,
          pickUpOffice
        ]
      )
      return order
    } catch (error) {
      throw new DBError(error, 'Error creating order.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM orders WHERE orderNumber = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting order.')
    }
  }

  static async update (id, input) {
    try {
      const existOrder = await this.getById({ id })
      if (existOrder.length === 0) return false
      const orderComplete = {
        orderDate: input.orderDate ?? existOrder[0].orderDate,
        requiredDate: input.requiredDate ?? existOrder[0].requiredDate,
        pickUpDate: input.pickUpDate ?? existOrder[0].pickUpDate,
        status: input.status ?? existOrder[0].status,
        comments: input.comments ?? existOrder[0].comments,
        customerNumber: input.customerNumber ?? existOrder[0].customerNumber,
        total: input.total ?? existOrder[0].total,
        paymentCheckNumber: input.paymentCheckNumber ?? existOrder[0].paymentCheckNumber,
        pickUpOffice: input.pickUpOffice ?? existOrder[0].pickUpOffice
      }
      await connection.query(
        `UPDATE orders
        SET orderDate = ?,
            requiredDate = ?,
            pickUpDate = ?,
            status = ?,
            comments = ?,
            customerNumber = ?,
            total = ?,
            paymentCheckNumber = ?,
            pickUpOffice = ?
        WHERE orderNumber = ?;`,
        [
          orderComplete.orderDate,
          orderComplete.requiredDate,
          orderComplete.pickUpDate,
          orderComplete.status,
          orderComplete.comments,
          orderComplete.customerNumber,
          orderComplete.total,
          orderComplete.paymentCheckNumber,
          orderComplete.pickUpOffice,
          id
        ]
      )
      return orderComplete
    } catch (error) {
      throw new Error(error, 'Error updating order.')
    }
  }

  static async getAllComplete ({ customerNumber }) {
    try {
      const [orders] = await connection.query(
        `SELECT
         o.orderNumber,
         o.orderDate,
         o.requiredDate,
         o.comments,
         c.customerName,
         o.total,
         os.title,
         pm.type
        FROM orders o
        JOIN customers c ON o.customerNumber = c.customerNumber
        JOIN orderstatus os ON o.status = os.id
        JOIN payments p ON o.paymentCheckNumber = p.checkNumber
        JOIN paymentmethods pm ON p.paymentMethod = pm.id;`
      )
      if (orders.length === 0) return []
      if (customerNumber) return orders.filter(e => (e.customerNumber === +customerNumber))
      return orders
    } catch (error) {
      throw new DBError(error, 'Error getting orders.')
    }
  }
}
