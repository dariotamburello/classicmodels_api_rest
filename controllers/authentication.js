import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { validateUser } from '../schemes/authentication.js'
import { configurationEncrypt } from '../configuration/encriptation.js'
import { AuthError, DataError, ValidationError } from '../utils/errorTypes.js'
import { errorTypes } from '../constants/errorTypes.js'
import { getFormattedDateTime } from '../helpers/datetimes.js'
import { globalSettings } from '../configuration/globalSettings.js'

export class AuthenticationController {
  constructor ({ usersModel }) {
    this.usersModel = usersModel
  }

  login = async (req, res, next) => {
    const { username, password } = req.body
    try {
      const userFound = await this.usersModel.getByUsername(username)
      if (!userFound || userFound.active === 0) throw new AuthError(errorTypes.ERROR_LOGIN, req)
      const checkPassword = await bcrypt.compare(password, userFound.password)
      if (!checkPassword) throw new AuthError(errorTypes.ERROR_LOGIN, req)
      this.usersModel.update(userFound.id, { lastLogin: getFormattedDateTime() })
      const token = jwt.sign(
        { id: userFound.id, username: userFound.username },
        configurationEncrypt.SECRET_KEY_CODE,
        {
          expiresIn: '1h'
        }
      )
      // console.log(token)
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.ENV === 'prd',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .send({
          id: userFound.id,
          username: userFound.username,
          usertype: userFound.usertype,
          registerAt: userFound.registerAt,
          lastLogin: userFound.lastLogin
        })
    } catch (error) {
      return next(error)
    }
  }

  register = async (req, res, next) => {
    try {
      const resultValidation = await validateUser(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))// return res.status(400).json({ error: JSON.parse(validation.error.message)[0].message })

      resultValidation.data.id = crypto.randomUUID()
      resultValidation.data.hashedPassword = await bcrypt.hash(resultValidation.data.password, configurationEncrypt.SALT_ROUNDS)
      resultValidation.data.registerAt = getFormattedDateTime()
      resultValidation.data.active = globalSettings.ACTIVE_USERS_AT_REGISTER
      resultValidation.data.usertype = globalSettings.DEFAULT_GROUP_NEW_USER

      const result = await this.usersModel.create(resultValidation.data)
      if (!result) throw new DataError('Can\'t create user.')

      res.json(result)
    } catch (error) {
      return next(error)
    }
  }

  logout = async (req, res) => {
    res
      .clearCookie('access_token')
      .json({ message: 'logout succesfully' })
  }
}
