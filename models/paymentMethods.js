import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'

const connection = await mysql.createConnection(configuration)

export class PaymentMethodsModel {
  static async getAll () {
    try {
      const [paymentMethods] = await connection.query(
        'SELECT * FROM paymentmethods;'
      )
      if (paymentMethods.length === 0) return []
      return paymentMethods
    } catch (e) {
      throw new Error(`Error getting payment methods: ${e.message}`)
    }
  }

  static async getById ({ id }) {
    try {
      const paymentMethod = await connection.query(
        'SELECT * FROM paymentMethods WHERE id = ?;',
        [id]
      )
      if (!paymentMethod) return []
      return paymentMethod[0]
    } catch (e) {
      throw new Error(`Error getting payment methods: ${e.message}`)
    }
  }

  static async create (input) {
    try {
      const {
        type,
        enabled
      } = input

      const result = await connection.query(
        `INSERT INTO paymentMethods (
            type,
            enabled
        ) VALUES (?, ?);`,
        [
          type,
          enabled
        ]
      )
      input.id = result[0].insertId
      return input
    } catch (e) {
      throw new Error(`Error creating payment methods: ${e.message}`)
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM paymentMethods WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (e) {
      throw new Error(`Error deleting payment methods: ${e.message}`)
    }
  }

  static async update (id, input) {
    try {
      const existPaymentMethod = await this.getById({ id })
      if (existPaymentMethod.length === 0) return false

      const paymentMethodComplete = {
        type: input.type ?? existPaymentMethod[0].type,
        enabled: input.enabled ?? existPaymentMethod[0].enabled
      }

      await connection.query(
        `UPDATE paymentMethods
        SET type = ?,
            enabled = ?
        WHERE id = ${id};`,
        [
          paymentMethodComplete.type,
          paymentMethodComplete.enabled
        ]
      )
      return paymentMethodComplete
    } catch (e) {
      throw new Error(`Error updating payment method: ${e.message}`)
    }
  }
}
