import { AppError, AuthError, BusinessError, DBError, DataError, MongoDBError, RenderError, ValidationError } from '../utils/errorTypes.js'
import { handleErrorLog } from '../helpers/handleLogs.js'

export const errorHandler = (error, req, res, next) => {
  const route = `${req.url}, ${req.method}`
  const header = req.rawHeaders

  if (error instanceof AppError) {
    handleErrorLog(error, route, header)
    res.redirect('/')
  }

  if (error instanceof BusinessError) {
    handleErrorLog(error, route, header)
  }

  if (error instanceof DBError) {
    handleErrorLog(error, route, header)
    res.status(error.statusCode).json(errorFormatToFront(error))
  }

  if (error instanceof MongoDBError) {
    handleErrorLog(error, route, header)
    res.status(error.statusCode).json(errorFormatToFront(error))
  }

  if (error instanceof DataError) {
    res.status(202).json(errorFormatToFront(error))
  }

  if (error instanceof ValidationError) {
    handleErrorLog(error, route, header)
    res.status(200).json(errorFormatToFront(error))
  }

  if (error instanceof AuthError) {
    handleErrorLog(error, route, header)
    res.status(401).json(errorFormatToFront(error))
  }

  if (error instanceof RenderError) {
    handleErrorLog(error, route, header)
  }

  next()
}

const errorFormatToFront = (error) => {
  return {
    error:
      {
        errorType: error.errorType,
        errorTitle: error.errorTitle
      }
  }
}
