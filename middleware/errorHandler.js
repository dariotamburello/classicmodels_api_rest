import { AppError, AuthError, BusinessError, DBError, DataError, RenderError, ValidationError } from '../utils/errorTypes.js'

export const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    console.log(error)
    res.redirect('/')
  }

  if (error instanceof BusinessError) {
    console.log(error)
  }

  if (error instanceof DBError) {
    console.log(error)
    res.status(error.statusCode).json(errorFormatToFront(error))
  }

  if (error instanceof DataError) {
    res.status(202).json(errorFormatToFront(error))
  }

  if (error instanceof ValidationError) {
    console.log(error)
    res.status(200).json(errorFormatToFront(error))
  }

  if (error instanceof AuthError) {
    console.log(error)
    res.status(401).json(errorFormatToFront(error))
  }

  if (error instanceof RenderError) {
    console.log(error)
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
