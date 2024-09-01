import { getFormattedDateTime } from '../helpers/datetimes.js'
import { validatePayment, validatePartialPayment } from '../schemes/payment.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class PaymentsController {
  constructor ({ paymentsModel }) {
    this.paymentsModel = paymentsModel
  }

  getAll = async (req, res, next) => {
    const { customerNumber } = req.query
    try {
      const payments = await this.paymentsModel.getAll({ customerNumber })
      res.json(payments)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const payments = await this.paymentsModel.getById({ id })
      res.json(payments)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validatePayment(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      resultValidation.data.paymentDate = getFormattedDateTime()
      const payment = await this.paymentsModel.create(resultValidation.data)
      if (!payment) throw new DataError('Can\'t create payment.')
      res.json(payment)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.paymentsModel.delete(id)
      if (!result) throw new DataError(`Payment id '${id}' not found.`)
      return res.json({ message: 'Payment deleted ' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialPayment(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.paymentsModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Payment id '${id}' not found.`)
      res.status(202).json(result)
    } catch (error) {
      return next(error)
    }
  }
}
