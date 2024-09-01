import { validateOrderStatus, validatePartialOrderStatus } from '../schemes/orderStatus.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class OrderStatusController {
  constructor ({ orderStatusModel }) {
    this.orderStatusModel = orderStatusModel
  }

  getAll = async (req, res, next) => {
    try {
      const orderStatus = await this.orderStatusModel.getAll()
      res.json(orderStatus)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const order = await this.orderStatusModel.getById({ id })
      res.json(order)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = validateOrderStatus(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const orderStatus = await this.orderStatusModel.create(resultValidation.data)
      if (!orderStatus) throw new DataError('Can\'t create order status.')
      res.json(orderStatus)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.orderStatusModel.delete(id)
      if (!result) throw new DataError(`Order status '${id}' not found.`)
      return res.json({ message: 'Order status deleted' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = validatePartialOrderStatus(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.orderStatusModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Order status id '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
