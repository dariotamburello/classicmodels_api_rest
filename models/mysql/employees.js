import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class EmployeeModel {
  static async getAll ({ officeCode }) {
    try {
      const [employees] = await connection.query(
        'SELECT * FROM employees;'
      )
      if (employees.length === 0) return []
      if (officeCode) return employees.filter(e => (e.officeCode === +officeCode))
      return employees
    } catch (error) {
      throw new DBError(error, 'Error getting employees.')
    }
  }

  static async getByEmail (email) {
    try {
      const employee = await connection.query(
        'SELECT email FROM employees WHERE email = ?;',
        [email]
      )
      if (!employee) return []
      return employee[0]
    } catch (error) {
      throw new DBError(error, 'Error getting employee.')
    }
  }

  static async getById ({ id }) {
    try {
      const employee = await connection.query(
        'SELECT * FROM employees WHERE employeeNumber = ?;',
        [id]
      )
      if (!employee) return []
      return employee[0]
    } catch (error) {
      throw new DBError(error, 'Error getting employee.')
    }
  }

  static async create (input) {
    try {
      const {
        lastName,
        firstName,
        extension,
        email,
        officeCode,
        reportsTo,
        jobTitle
      } = input

      const result = await connection.query(
                `INSERT INTO employees (
                    lastName,
                    firstName,
                    extension,
                    email,
                    officeCode,
                    reportsTo,
                    jobTitle
                ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [
                  lastName,
                  firstName,
                  extension,
                  email,
                  officeCode,
                  reportsTo,
                  jobTitle
                ]
      )
      input.employeeNumber = result[0].insertId
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating employee.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM employees WHERE employeeNumber = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting employee.')
    }
  }

  static async update (id, input) {
    try {
      const existEmployee = await this.getById({ id })
      if (existEmployee.length === 0) return false

      const employeeComplete = {
        lastName: input.lastName ?? existEmployee[0].lastName,
        firstName: input.firstName ?? existEmployee[0].firstName,
        extension: input.extension ?? existEmployee[0].extension,
        email: input.email ?? existEmployee[0].email,
        officeCode: input.officeCode ?? existEmployee[0].officeCode,
        reportsTo: input.reportsTo ?? existEmployee[0].reportsTo,
        jobTitle: input.jobTitle ?? existEmployee[0].jobTitle
      }

      await connection.query(
                `UPDATE employees
                SET lastName = ?,
                    firstName = ?,
                    extension = ?,
                    email = ?,
                    officeCode = ?,
                    reportsTo = ?,
                    jobTitle = ?
                WHERE employeeNumber = '${id}';`,
                [
                  employeeComplete.lastName,
                  employeeComplete.firstName,
                  employeeComplete.extension,
                  employeeComplete.email,
                  employeeComplete.officeCode,
                  employeeComplete.reportsTo,
                  employeeComplete.jobTitle
                ]
      )

      return employeeComplete
    } catch (error) {
      throw new DBError(error, 'Error updating employee.')
    }
  }
}
