import mysql from 'mysql2/promise'
import { configuration } from '../configuration/dbConnections.js'
import { DBError } from '../utils/errorTypes.js'

const connection = await mysql.createConnection(configuration)

export class CustomerModel {
  static async getAll ({ salesRepEmployeeNumber }) {
    try {
      const [customers] = await connection.query(
        'SELECT * FROM customers;'
      )
      if (customers.length === 0) return []
      if (salesRepEmployeeNumber) return customers.filter(e => (e.salesRepEmployeeNumber === +salesRepEmployeeNumber))
      return customers
    } catch (error) {
      throw new DBError(error, 'Error getting customers.')
    }
  }

  static async getById ({ id }) {
    try {
      const customer = await connection.query(
        'SELECT * FROM customers WHERE customerNumber = ?;',
        [id]
      )
      if (!customer) return []
      return customer[0]
    } catch (error) {
      throw new DBError(error, 'Error getting customer.')
    }
  }

  static async create (input) {
    try {
      const {
        customerName,
        contactLastName,
        contactFirstName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        salesRepEmployeeNumber,
        creditLimit
      } = input

      const result = await connection.query(
        `INSERT INTO customers (
            customerName,
            contactLastName,
            contactFirstName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            salesRepEmployeeNumber,
            creditLimit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          customerName,
          contactLastName,
          contactFirstName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country,
          salesRepEmployeeNumber,
          creditLimit
        ]
      )
      input.customerNumber = result[0].insertId
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating customer.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM customers WHERE customerNumber = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting customer.')
    }
  }

  static async update (id, input) {
    try {
      const existCustomer = await this.getById({ id })
      if (existCustomer.length === 0) return false

      const customerComplete = {
        customerName: input.customerName ?? existCustomer[0].customerName,
        contactLastName: input.contactLastName ?? existCustomer[0].contactLastName,
        contactFirstName: input.contactFirstName ?? existCustomer[0].contactFirstName,
        phone: input.phone ?? existCustomer[0].phone,
        addressLine1: input.addressLine1 ?? existCustomer[0].addressLine1,
        addressLine2: input.addressLine2 ?? existCustomer[0].addressLine2,
        city: input.city ?? existCustomer[0].city,
        state: input.state ?? existCustomer[0].state,
        postalCode: input.postalCode ?? existCustomer[0].postalCode,
        country: input.country ?? existCustomer[0].country,
        salesRepEmployeeNumber: input.salesRepEmployeeNumber ?? existCustomer[0].salesRepEmployeeNumber,
        creditLimit: input.creditLimit ?? existCustomer[0].creditLimit
      }

      await connection.query(
                `UPDATE customers
                SET customerName = ?,
                    contactLastName = ?,
                    contactFirstName = ?,
                    phone = ?,
                    addressLine1 = ?,
                    addressLine2 = ?,
                    city = ?,
                    state = ?,
                    postalCode = ?,
                    country = ?,
                    salesRepEmployeeNumber = ?,
                    creditLimit = ?
                WHERE customerNumber = '${id}';`,
                [
                  customerComplete.customerName,
                  customerComplete.contactLastName,
                  customerComplete.contactFirstName,
                  customerComplete.phone,
                  customerComplete.addressLine1,
                  customerComplete.addressLine2,
                  customerComplete.city,
                  customerComplete.state,
                  customerComplete.postalCode,
                  customerComplete.country,
                  customerComplete.salesRepEmployeeNumber,
                  customerComplete.creditLimit
                ]
      )

      return customerComplete
    } catch (error) {
      throw new DBError(error, 'Error updating customer.')
    }
  }
}
