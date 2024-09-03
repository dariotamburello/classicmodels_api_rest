import crypto from 'node:crypto'
import { validatePaymentMethod, validatePartialPaymentMethod } from '../schemes/paymentMethods.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class PaymentMethodsController {
  constructor ({ paymentMethodsModel }) {
    this.paymentMethodsModel = paymentMethodsModel
  }

  getAll = async (req, res, next) => {
    try {
      const paymentMethods = await this.paymentMethodsModel.getAllActive()
      res.json(paymentMethods)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const paymentMethod = await this.paymentMethodsModel.getById({ id })
      res.json(paymentMethod)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = validatePaymentMethod(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      resultValidation.data.id = crypto.randomUUID()
      const paymentMethod = await this.paymentMethodsModel.create(resultValidation.data)
      if (!paymentMethod) throw new DataError('Can\'t create payment method.')
      res.json(paymentMethod)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.paymentMethodsModel.delete(id)
      if (!result) throw new DataError(`Payment method '${id}' not found.`)
      return res.json({ message: 'Payment method deleted ' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = validatePartialPaymentMethod(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.paymentMethodsModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Payment method id '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
