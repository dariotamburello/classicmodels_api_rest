import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class LogsModel {
  static async getAll () {
    try {
      const [logs] = await connection.query(
        'SELECT * FROM logs;'
      )
      if (logs.length === 0) return []
      return logs
    } catch (error) {
      throw new DBError(error, 'Error getting logs.')
    }
  }

  static async getById ({ id }) {
    try {
      const logs = await connection.query(
        'SELECT * FROM logs WHERE id = ?;',
        [id]
      )
      if (!logs) return []
      return logs[0]
    } catch (error) {
      throw new DBError(error, 'Error getting logs.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        datetime,
        type,
        description,
        originurl,
        originheader
      } = input

      await connection.query(
        `INSERT INTO logs (
            id,
            datetime,
            type,
            description,
            originurl,
            originheader
        ) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          id,
          datetime,
          type,
          description,
          originurl,
          originheader
        ]
      )
      return input
    } catch (error) {
      throw new DBError(error, 'Error creating log.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM logs WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting log.')
    }
  }

  static async update (id, input) {
    try {
      const existLog = await this.getById({ id })
      if (existLog.length === 0) return false

      const logComplete = {
        id: input.id ?? existLog[0].id,
        datetime: input.datetime ?? existLog[0].datetime,
        type: input.type ?? existLog[0].type,
        description: input.description ?? existLog[0].description,
        originurl: input.originurl ?? existLog[0].originurl,
        originheader: input.originheader ?? existLog[0].originheader
      }

      await connection.query(
        `UPDATE logs
        SET datetime = ?,
            type = ?,
            description = ?,
            originurl = ?,
            originheader = ?
        WHERE id = ? ;`,
        [
          logComplete.datetime,
          logComplete.type,
          logComplete.description,
          logComplete.originurl,
          logComplete.originheader,
          logComplete.id
        ]
      )

      return logComplete
    } catch (error) {
      throw new DBError(error, 'Error updating log.')
    }
  }
}
