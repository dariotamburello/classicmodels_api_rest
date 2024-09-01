import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { configurationEncrypt } from '../configuration/encriptation.js'
import { globalSettings } from '../configuration/globalSettings.js'
import { getFormattedDateTime } from '../helpers/datetimes.js'
import { validatePartialUser, validateUser } from '../schemes/authentication.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class UsersController {
  constructor ({ usersModel }) {
    this.usersModel = usersModel
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.usersModel.getAll()
      res.json(users)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await this.usersModel.getById({ id })
      if (user.length === 0) throw new DataError('User not found.')
      res.json(user)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validateUser(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))

      resultValidation.data.id = crypto.randomUUID()
      resultValidation.data.hashedPassword = await bcrypt.hash(resultValidation.data.password, configurationEncrypt.SALT_ROUNDS)
      resultValidation.data.registerAt = getFormattedDateTime()
      resultValidation.data.active = globalSettings.ACTIVE_USERS_AT_REGISTER
      resultValidation.data.usertype = globalSettings.DEFAULT_GROUP_NEW_USER

      const result = await this.usersModel.create(resultValidation.data)
      if (!result) throw new ValidationError('Can\'t create user')
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await this.usersModel.delete(id)
      if (!user) throw new DataError('User not found')
      return res.json({ message: 'User deleted' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialUser(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      resultValidation.data.password = resultValidation.data.password
        ? await bcrypt.hash(resultValidation.data.password, configurationEncrypt.SALT_ROUNDS)
        : null
      const result = await this.usersModel.update(id, resultValidation.data)
      if (!result) throw new DataError('User not found')
      res.status(200).json({ message: 'User updated' })
    } catch (error) {
      return next(error)
    }
  }
}
