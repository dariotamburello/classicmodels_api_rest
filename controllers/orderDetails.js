import { refreshScheme, validateOrderDetail, validatePartialOrderDetail } from '../schemes/orderDetail.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class OrderDetailsController {
  constructor ({ orderDetailsModel }) {
    this.orderDetailsModel = orderDetailsModel
  }

  getAll = async (req, res, next) => {
    const { orderNumber } = req.query
    try {
      const orderDetails = await this.orderDetailsModel.getAll({ orderNumber })
      res.json(orderDetails)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    const { orderLineNumber } = req.query
    try {
      const orderDetails = await this.orderDetailsModel.getById({ orderNumber: id, orderLineNumber })
      // if (!orderDetails) return res.status(404).json({ error: 'Order details not found' })
      res.json(orderDetails)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    const orderDetailsLines = req.body
    const validation = []
    refreshScheme()
    try {
      for (const o of orderDetailsLines) {
        const resultValidation = (await validateOrderDetail(o))
        if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
        validation.push(resultValidation.data)
      }
      const orderDetails = await this.orderDetailsModel.create(validation)
      if (!orderDetails) throw new DataError('Can\'t create order details.')
      res.json(orderDetails)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    const { orderLineNumber } = req.query
    try {
      const orderDetails = await this.orderDetailsModel.delete({ orderNumber: id, orderLineNumber })
      if (!orderDetails) throw new DataError('Order details not found.')
      return res.json({ message: 'Order details deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { orderLineNumber } = req.query
    try {
      const resultValidation = await validatePartialOrderDetail(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.orderDetailsModel.update({ orderNumber: id }, orderLineNumber, resultValidation.data)
      if (!result) throw new DataError('Order details not found')
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
