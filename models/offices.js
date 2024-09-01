import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'
import { DBError } from '../utils/errorTypes.js'
// import { OrderModel } from './orders.js'
// import { generateCheckNumber } from '../helpers/payments.js'

const connection = await mysql.createConnection(configuration)

export class OfficeModel {
  static async getAll () {
    try {
      // const orders = await OrderModel.getAll('')
      // // console.log(orders)
      // orders.map(async (order) => {
      //   const orderNumber = order.orderNumber
      //   const total = order.total
      //   const status = order.status
      //   let payStatus = 3
      //   if (status === 'efc52444-656a-11ef-91c8-00ff57cc6be4') {
      //     payStatus = 1
      //   }
      //   const customer = order.customerNumber
      //   const paymentDate = new Date(order.orderDate).toISOString().slice(0, 19).replace('T', ' ') // Format YYYY-MM-DD HH:MM:SS

      //   const paymentmethod = order.paymentMethod
      //   const checknumber = generateCheckNumber()
      //   console.log(customer, checknumber, paymentDate, total, payStatus, paymentmethod)

      //   await connection.query(
      //     `INSERT INTO payments (
      //     customerNumber,
      //     checkNumber,
      //     paymentDate,
      //     amount,
      //     paymentStatus,
      //     paymentMethod) VALUES (
      //     ${customer}, '${checknumber}', '${paymentDate}', ${total}, '${payStatus}', '${paymentmethod}' )
      //     `
      //   )

      //   await connection.query(
      //     `UPDATE orders
      //     set paymentCheckNumber = '${checknumber}'
      //     WHERE orderNumber = ${orderNumber}`
      //   )

      //   return true
      // })
      const [offices] = await connection.query(
        'SELECT * FROM offices;'
      )
      if (offices.length === 0) return []
      return offices
    } catch (error) {
      throw new DBError(error, 'Error getting offices.')
    }
  }

  static async getById ({ id }) {
    try {
      const office = await connection.query(
        'SELECT * FROM offices WHERE id = ?;',
        [id]
      )
      if (!office) return []
      return office[0]
    } catch (error) {
      throw new DBError(error, 'Error getting office.')
    }
  }

  static async create (input) {
    try {
      const {
        city,
        phone,
        addressLine1,
        addressLine2,
        state,
        country,
        postalCode,
        territory
      } = input

      const result = await connection.query(
        `INSERT INTO offices (
            city,
            phone,
            addressLine1,
            addressLine2,
            state,
            country,
            postalCode,
            territory
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          city,
          phone,
          addressLine1,
          addressLine2,
          state,
          country,
          postalCode,
          territory
        ]
      )
      input.officeCode = result[0].insertId
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating office.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM offices WHERE officecode = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting office.')
    }
  }

  static async update (id, input) {
    try {
      const existOffice = await this.getById({ id })
      if (existOffice.length === 0) return false

      const officeComplete = {
        city: input.city ?? existOffice[0].city,
        phone: input.phone ?? existOffice[0].phone,
        addressLine1: input.addressLine1 ?? existOffice[0].addressLine1,
        addressLine2: input.addressLine2 ?? existOffice[0].addressLine2,
        state: input.state ?? existOffice[0].state,
        country: input.country ?? existOffice[0].country,
        postalCode: input.postalCode ?? existOffice[0].postalCode,
        territory: input.territory ?? existOffice[0].territory
      }

      await connection.query(
        `UPDATE offices
        SET city = ?,
            phone = ?,
            addressLine1 = ?,
            addressLine2 = ?,
            state = ?,
            country = ?,
            postalCode = ?,
            territory = ?
        WHERE officeCode = ?;`,
        [
          officeComplete.city,
          officeComplete.phone,
          officeComplete.addressLine1,
          officeComplete.addressLine2,
          officeComplete.state,
          officeComplete.country,
          officeComplete.postalCode,
          officeComplete.territory,
          id
        ]
      )

      return officeComplete
    } catch (error) {
      throw new DBError(error, 'Error updating offices.')
    }
  }
}
