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
    this.description = `[DBError] SQLMSG: ${message.sqlMessage}`
  }
}

export class AppError extends Error {
  constructor (message, module) {
    super(message)
    this.module = module
    // this.errorType = errorType
    // this.errorMessage = message.TypeError
    this.stack = null
    this.description = `[AppError] MODULE: ${module}`
  }
}

export class DataError {
  constructor (errorTitle) {
    this.errorType = errorTypes.ERROR_DATAERROR
    this.errorTitle = errorTitle
    this.description = `[DataError] ERR: ${errorTitle}`
  }
}

export class ValidationError {
  constructor (errorTitle) {
    this.errorType = errorTypes.ERROR_VALIDATION
    this.errorTitle = errorTitle[0].message
    this.description = `[ValidationError] ERR: ${errorTitle[0].message}`
  }
}

export class AuthError {
  constructor (errorTitle, req) {
    const errorDetails = `url: ${req.baseUrl}, method: ${req.method}, user: ${req.session?.user?.username}`
    this.errorType = errorTypes.ERROR_AUTHENTICATION
    this.errorTitle = errorTitle
    this.errorDetails = errorDetails
    this.description = `[AuthError] ERR: ${errorDetails}`
  }
}

export class BusinessError {
  constructor (module, errorType, errorMessage) {
    this.module = module
    this.errorType = errorType
    this.errorMessage = errorMessage
    this.description = `[BussinessError] MODULE: ${module}, ERR: ${errorMessage}`
  }
}

export class RenderError extends Error {
  constructor (message) {
    super(message)
    this.error = message
    this.errorType = errorTypes.ERROR_RENDER
    this.errorMessage = message
    this.description = `[RenderError] ERR: ${message}`
  }
}
