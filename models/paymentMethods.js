import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'
import { DBError } from '../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class PaymentMethodsModel {
  static async getAll () {
    try {
      const [paymentMethods] = await connection.query(
        'SELECT * FROM paymentmethods;'
      )
      if (paymentMethods.length === 0) return []
      return paymentMethods
    } catch (error) {
      throw new DBError(error, 'Error getting payments methods.')
    }
  }

  static async getAllActive () {
    try {
      const [paymentMethods] = await connection.query(
        'SELECT * FROM paymentmethods WHERE enabled = 1;'
      )
      if (paymentMethods.length === 0) return []
      return paymentMethods
    } catch (error) {
      throw new DBError(error, 'Error getting payments methods.')
    }
  }

  static async getById ({ id }) {
    try {
      const paymentMethod = await connection.query(
        'SELECT * FROM paymentmethods WHERE id = ?;',
        [id]
      )
      if (!paymentMethod) return []
      return paymentMethod[0]
    } catch (error) {
      throw new DBError(error, 'Error getting payments methods.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        type,
        enabled
      } = input

      const result = await connection.query(
        `INSERT INTO paymentmethods (
            id,
            type,
            enabled
        ) VALUES (?, ?, ?);`,
        [
          id,
          type,
          enabled
        ]
      )
      input.id = result[0].insertId
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating payment methods.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM paymentmethods WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting payment methods.')
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
        `UPDATE paymentmethods
        SET type = ?,
            enabled = ?
        WHERE id = ?`,
        [
          id,
          paymentMethodComplete.type,
          paymentMethodComplete.enabled
        ]
      )
      return paymentMethodComplete
    } catch (error) {
      throw new DBError(error, 'Error updating payment method.')
    }
  }
}
