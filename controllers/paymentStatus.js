import { validatePartialPaymentStatus, validatePaymentStatus } from '../schemes/paymentStatus.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class PaymentStatusController {
  constructor ({ paymentStatusModel }) {
    this.paymentStatusModel = paymentStatusModel
  }

  getAll = async (req, res, next) => {
    try {
      const paymentStatus = await this.paymentStatusModel.getAll()
      res.json(paymentStatus)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const paymentStatus = await this.paymentStatusModel.getById({ id })
      res.json(paymentStatus)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validatePaymentStatus(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const paymentStatus = await this.paymentStatusModel.create(resultValidation.data)
      if (!paymentStatus) throw new DataError('Can\'t create payment status.')
      res.json(paymentStatus)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.paymentsModel.delete(id)
      if (!result) throw new DataError(`Payment status id '${id}' not found.`)
      return res.json({ message: 'Payment status deleted ' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialPaymentStatus(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.paymentsModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Payment status id '${id}' not found.`)
      res.status(202).json(result)
    } catch (error) {
      return next(error)
    }
  }
}
