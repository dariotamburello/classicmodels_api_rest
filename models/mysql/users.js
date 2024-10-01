import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class UsersModel {
  static async getAll () {
    try {
      const [users] = await connection.query(
        'SELECT * FROM users;'
      )
      if (users.length === 0) return []
      return users
    } catch (error) {
      throw new DBError(error, 'Error getting users.')
    }
  }

  static async getById ({ id }) {
    try {
      const user = await connection.query(
        'SELECT * FROM users WHERE id = ?;',
        [id]
      )
      if (!user) return []
      return user[0]
    } catch (error) {
      throw new DBError(error, 'Error getting user.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        username,
        hashedPassword,
        registerAt,
        active,
        usergroup
      } = input

      await connection.query(
        'INSERT INTO users SET id = ?, username = ?, password = ?, registerAt = ?, active = ?, usergroup = ?;',
        [id, username, hashedPassword, registerAt, active, usergroup]
      )

      return { id, username, registerAt }
    } catch (error) {
      throw new DBError(error, 'Error creating user')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM users WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting user.')
    }
  }

  static async update (id, input) {
    try {
      const existUser = await this.getById({ id })
      if (existUser.length === 0) return false

      const newUser = {
        password: input.password ?? existUser[0].password,
        lastLogin: input.lastLogin ?? existUser[0].lastLogin,
        active: input.active ?? existUser[0].active,
        usergroup: input.usergroup ?? existUser[0].usergroup
      }

      const result = await connection.query(
        `UPDATE users 
        SET password = ?, lastLogin = ?, active = ?, usergroup = ?
        WHERE id = ?;`,
        [
          newUser.password, newUser.lastLogin, newUser.active, newUser.usergroup, id
        ]
      )
      if (!result) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error updating user.')
    }
  }

  static async getByUsername (username) {
    try {
      const user = await connection.query(
        'SELECT * FROM users WHERE username = ?;',
        [username]
      )
      if (user[0].length === 0) return false
      return user[0][0]
    } catch (error) {
      throw new DBError(error, 'Error getting user.')
    }
  }
}
