import { OrderDetailsModel } from '../models/orderDetails.js'
import { getFormattedDateTime } from '../helpers/datetimes.js'
import { validateOrder, validatePartialOrder } from '../schemes/order.js'
import { refreshScheme, validateOrderDetail } from '../schemes/orderDetail.js'
import { AppError, DataError, ValidationError } from '../utils/errorTypes.js'
import { errorTypes } from '../constants/errorTypes.js'

export class OrderController {
  constructor ({ orderModel }) {
    this.orderModel = orderModel
  }

  getAll = async (req, res, next) => {
    const { customerNumber } = req.query
    try {
      const orders = await this.orderModel.getAll({ customerNumber })
      res.json(orders)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    const complete = req.query.complete
    try {
      const order = await this.orderModel.getById({ id })
      if (order.length > 0 && complete === 'true') {
        const orderDetails = await OrderDetailsModel.getAllComplete({ orderNumber: id })
        order[0].details = orderDetails
      }
      res.json(order)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validateOrder(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))

      resultValidation.data.orderDate = getFormattedDateTime()
      const order = await this.orderModel.create(resultValidation.data)
      if (!order) throw new DataError('Can\'t create order.')

      const { orderDetails } = req.body
      if (orderDetails) {
        refreshScheme()
        const validation = []
        for (const o of orderDetails) {
          o.orderNumber = order.orderNumber
          const orderDetailsresult = (await validateOrderDetail(o))
          if (orderDetailsresult.error) {
            await rollbackOrder(this, order.orderNumber)
            throw new ValidationError(JSON.parse(orderDetailsresult.error.message))
          }
          validation.push(orderDetailsresult.data)
        }
        const orderDetailsCreate = await OrderDetailsModel.create(validation)
        if (!orderDetailsCreate) {
          await rollbackOrder(this, order.orderNumber)
          throw new DataError('Can\'t create order details.')
        }
      }
      res.json(order)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const order = await this.orderModel.delete(id)
      if (!order) throw new DataError('Order not found.')
      return res.json({ message: 'Order deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const validation = await validatePartialOrder(req.body)
      if (validation.error) throw new ValidationError(JSON.parse(validation.error.message))
      const result = await this.orderModel.update(id, validation.data)
      if (!result) throw new DataError('Order not found.')
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}

const rollbackOrder = async (model, id) => {
  const rollbackOrder = await model.orderModel.delete(id)
  if (!rollbackOrder) throw new AppError(model.constructor.name, errorTypes.ERROR_ROLL_BACK, 'Warning: order created without orderDetails.')
  return ({ message: 'Order deleted.' })
}
