import crypto from 'node:crypto'
import { DataError } from '../utils/errorTypes.js'
import { getFormattedDateTime } from '../helpers/datetimes.js'

export class LogsController {
  constructor ({ logsModel }) {
    this.logsModel = logsModel
  }

  getAll = async (req, res, next) => {
    try {
      const logs = await this.logsModel.getAll()
      res.json(logs)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const logs = await this.logsModel.getById({ id })
      res.json(logs)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      req.body.id = crypto.randomUUID()
      req.body.datetime = getFormattedDateTime()
      const log = await this.logsModel.create(req.body)
      if (!log) throw new DataError('Can\'t create log.')
      res.json(log)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.logsModel.delete(id)
      if (!result) throw new DataError(`Log id '${id}' not found.`)
      return res.json({ message: 'Log deleted' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.logsModel.update(id, req.body)
      if (!result) throw new DataError(`Log id '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
