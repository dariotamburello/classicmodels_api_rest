import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class PaymentsModel {
  static async getAll ({ customerNumber }) {
    try {
      const [payments] = await connection.query(
        'SELECT * FROM payments;'
      )
      if (payments.length === 0) return []
      if (customerNumber) return payments.filter(p => (p.customerNumber === +customerNumber))
      return payments
    } catch (error) {
      throw new DBError(error, 'Error getting payments.')
    }
  }

  static async getAllComplete () {
    try {
      const [payments] = await connection.query(
        `SELECT 
          p.checkNumber,
          c.customerName AS customerName,
          p.paymentDate,
          p.amount,
          ps.title,
          pm.type
        FROM payments p
        JOIN customers c ON p.customerNumber = c.customerNumber
        JOIN paymentstatus ps ON p.paymentstatus = ps.id
        JOIN paymentmethods pm ON p.paymentmethod = pm.id;`
      )
      if (payments.length === 0) return []
      return payments
    } catch (error) {
      throw new DBError(error, 'Error getting payments.')
    }
  }

  static async getById ({ id }) {
    try {
      const payment = await connection.query(
        'SELECT * FROM payments WHERE checkNumber = ?;',
        [id]
      )
      if (!payment) return []
      return payment[0]
    } catch (error) {
      throw new DBError(error, 'Error getting payment.')
    }
  }

  static async create (input) {
    try {
      const {
        customerNumber,
        amount,
        paymentStatus,
        paymentMethod,
        paymentDate,
        checkNumber
      } = input

      await connection.query(
        `INSERT INTO payments (
            customerNumber,
            checkNumber,
            paymentDate,
            amount,
            paymentStatus,
            paymentMethod
        ) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          customerNumber,
          checkNumber,
          paymentDate,
          amount,
          paymentStatus,
          paymentMethod
        ]
      )
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating payment.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM payments WHERE checkNumber = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting payment.')
    }
  }

  static async update (id, input) {
    try {
      const existPayment = await this.getById({ id })
      if (existPayment.length === 0) return false
      const paymentComplete = {
        customerNumber: input.customerNumber ?? existPayment[0].customerNumber,
        paymentDate: input.paymentDate ?? existPayment[0].paymentDate,
        paymentStatus: input.paymentStatus ?? existPayment[0].paymentStatus,
        paymentMethod: input.paymentMethod ?? existPayment[0].paymentMethod
      }

      await connection.query(
        `UPDATE payments
        SET customerNumber = ?,
            paymentDate = ?,
            paymentStatus = ?,
            paymentMethod = ?
        WHERE checkNumber = ?;`,
        [
          paymentComplete.customerNumber,
          paymentComplete.paymentDate,
          paymentComplete.paymentStatus,
          paymentComplete.paymentMethod,
          id
        ]
      )
      return paymentComplete
    } catch (error) {
      throw new DBError(error, 'Error updating payment.')
    }
  }
}
