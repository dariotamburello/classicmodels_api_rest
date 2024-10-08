import jwt from 'jsonwebtoken'
import { configurationEncrypt } from '../configuration/encriptation.js'
import { AuthError } from '../utils/errorTypes.js'
import { errorTypes } from '../constants/errorTypes.js'
import { userGroups } from '../constants/userGroups.js'
import { defaultDataModel } from '../server-data-model.js'

export const checkToken = (req, res, next) => {
  const token = req.cookies?.access_token
  req.session = { user: null }
  try {
    const data = jwt.verify(token, configurationEncrypt.SECRET_KEY_CODE)
    if (data === null) req.session.user = null
    req.session.user = data
    next()
  } catch (error) {
    req.session.user = null
    next()
  }
}

export const validateSession = (req, res, next) => {
  const token = req.cookies?.access_token
  req.session = { user: null }
  try {
    const data = jwt.verify(token, configurationEncrypt.SECRET_KEY_CODE)
    if (data === null) throw new AuthError(errorTypes.ERROR_ACCESS_DENIED, req)
    req.session.user = data
    next()
  } catch (error) {
    req.session.user = null
    throw new AuthError(errorTypes.ERROR_ACCESS_DENIED, req)
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    if (req.session.user === null) throw new AuthError(errorTypes.ERROR_ACCESS_DENIED, req)
    const userFound = await defaultDataModel.UsersModel.getById(req.session.user)
    if (userFound[0].usergroup !== userGroups.ADMIN) throw new AuthError(errorTypes.ERROR_ACCESS_DENIED, req)
    next()
  } catch (error) {
    return next(error)
  }
}

export const checkAdminUser = async (req, res, next) => {
  try {
    if (req.session.user === null) return false
    const userFound = await defaultDataModel.UsersModel.getById(req.session.user)
    if (userFound[0].usergroup !== userGroups.ADMIN) return false
    next()
  } catch (error) {
    return next(error)
  }
}
