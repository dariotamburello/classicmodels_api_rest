import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class OrderDetailsModel {
  static async getAll ({ orderNumber }) {
    try {
      const [ordersDetails] = await connection.query(
        'SELECT * FROM orderdetails;'
      )
      if (ordersDetails.length === 0) return []
      if (orderNumber) { return ordersDetails.filter(e => (e.orderNumber === +orderNumber)) }
      return ordersDetails
    } catch (error) {
      throw new DBError(error, 'Error getting order details.')
    }
  }

  static async getAllComplete ({ orderNumber }) {
    try {
      const [ordersDetails] = await connection.query(
        `SELECT
         od.orderNumber,
         od.productId,
         p.productCode,
         p.productName,
         od.quantityOrdered,
         p.buyPrice,
         od.orderLineNumber,
         p.productImage
        FROM orderdetails od
        JOIN products p ON od.productId = p.id;`
      )
      if (ordersDetails.length === 0) return []
      if (orderNumber) { return ordersDetails.filter(e => (e.orderNumber === +orderNumber)) }
      return ordersDetails
    } catch (error) {
      throw new DBError(error, 'Error getting order details.')
    }
  }

  static async getById ({ orderNumber, orderLineNumber }) {
    try {
      const orderDetails = await connection.query(
        'SELECT * FROM orderdetails WHERE orderNumber = ? AND orderLineNumber = ?;',
        [orderNumber, orderLineNumber]
      )
      if (!orderDetails) return []
      return orderDetails[0]
    } catch (error) {
      throw new DBError(error, 'Error getting order details.')
    }
  }

  static async create (input) {
    try {
      for (const detail of input) {
        const {
          orderNumber,
          productCode,
          quantityOrdered,
          orderLineNumber
        } = detail

        await connection.query(
          `INSERT INTO orderdetails (
              orderNumber,
              productId,
              quantityOrdered,
              orderLineNumber
          ) VALUES (?, ?, ?, ?);`,
          [
            orderNumber,
            productCode,
            quantityOrdered,
            orderLineNumber
          ]
        )
      }
      await connection.commit()
      return input
    } catch (error) {
      await connection.rollback()
      throw new Error(error, 'Error creating order details.')
    }
  }

  static async delete ({ orderNumber, orderLineNumber }) {
    try {
      const result = await connection.query(
        'DELETE FROM orderdetails WHERE orderNumber = ? AND orderLineNumber = ?;',
        [orderNumber, orderLineNumber]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting order details.')
    }
  }

  static async update ({ orderNumber }, orderLineNumber, input) {
    try {
      const existOrderDetail = await this.getById({ orderNumber, orderLineNumber })
      if (existOrderDetail.length === 0) return false

      const orderDetailsComplete = {
        orderNumber: input.orderNumber ?? existOrderDetail[0].orderNumber,
        productCode: input.productCode ?? existOrderDetail[0].productCode,
        quantityOrdered: input.quantityOrdered ?? existOrderDetail[0].quantityOrdered,
        orderLineNumber: input.orderLineNumber ?? existOrderDetail[0].orderLineNumber
      }

      await connection.query(
        `UPDATE orderdetails
        SET orderNumber = ?,
          productId = ?,
          quantityOrdered = ?,
          orderLineNumber = ?
        WHERE orderNumber = ? AND orderLineNumber = ?;`,
        [
          orderDetailsComplete.orderNumber,
          orderDetailsComplete.productCode,
          orderDetailsComplete.quantityOrdered,
          orderDetailsComplete.priceEach,
          orderDetailsComplete.orderLineNumber,
          orderNumber,
          orderLineNumber
        ]
      )
      return orderDetailsComplete
    } catch (error) {
      throw new DBError(error, 'Error updating order details.')
    }
  }
}
