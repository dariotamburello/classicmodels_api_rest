import mysql from 'mysql2/promise'
import { configuration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class PaymentStatusModel {
  static async getAll () {
    try {
      const [payments] = await connection.query(
        'SELECT * FROM paymentstatus;'
      )
      if (payments.length === 0) return []
      return payments
    } catch (error) {
      throw new DBError(error, 'Error getting payments status.')
    }
  }

  static async getById ({ id }) {
    try {
      const payment = await connection.query(
        'SELECT * FROM paymentstatus WHERE id = ?;',
        [id]
      )
      if (!payment) return []
      return payment[0]
    } catch (error) {
      throw new DBError(error, 'Error getting payment status.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        title,
        description
      } = input

      await connection.query(
        `INSERT INTO paymentstatus (
            id,
            title,
            description
        ) VALUES (?, ?, ?);`,
        [
          id,
          title,
          description
        ]
      )
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating payment status.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM paymentstatus WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting payment status.')
    }
  }

  static async update (id, input) {
    try {
      const existPayment = await this.getById({ id })
      if (existPayment.length === 0) return false

      const paymentComplete = {
        id: input.id ?? existPayment[0].id,
        title: input.title ?? existPayment[0].title,
        description: input.description ?? existPayment[0].description
      }

      await connection.query(
        `UPDATE payments
        SET id = ?,
            title = ?,
            description = ?
        WHERE id = ?;`,
        [
          paymentComplete.id,
          paymentComplete.title,
          paymentComplete.description,
          id
        ]
      )
      return paymentComplete
    } catch (error) {
      throw new DBError(error, 'Error updating payment status.')
    }
  }
}
