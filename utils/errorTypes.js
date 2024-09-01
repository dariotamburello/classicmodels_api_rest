import { errorTypes } from '../constants/errorTypes.js'

export class DBError extends Error {
  constructor (message, errorTitle) {
    super(message)
    this.sqlError = message.sql
    this.sqlMessage = message.sqlMessage
    this.errorType = errorTypes.ERROR_DATABASE
    this.errorTitle = errorTitle
    this.statusCode = 500
    this.stack = null
  }
}

export class AppError extends Error {
  constructor (message, module) {
    super(message)
    this.module = module
    // this.errorType = errorType
    // this.errorMessage = message.TypeError
    this.stack = null
  }
}

export class DataError {
  constructor (errorTitle) {
    this.errorType = errorTypes.ERROR_DATAERROR
    this.errorTitle = errorTitle
  }
}

export class ValidationError {
  constructor (errorTitle) {
    this.errorType = errorTypes.ERROR_VALIDATION
    this.errorTitle = errorTitle[0].message
  }
}

export class AuthError {
  constructor (errorTitle, req) {
    const errorDetails = `url: ${req.baseUrl}, method: ${req.method}, user: ${req.session?.user?.username}`
    this.errorType = errorTypes.ERROR_AUTHENTICATION
    this.errorTitle = errorTitle
    this.errorDetails = errorDetails
  }
}

export class BusinessError {
  constructor (module, errorType, errorMessage) {
    this.module = module
    this.errorType = errorType
    this.errorMessage = errorMessage
  }
}

export class RenderError extends Error {
  constructor (message) {
    super(message)
    this.error = message
  }
}
