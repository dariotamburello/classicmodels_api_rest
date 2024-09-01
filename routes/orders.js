import { Router } from 'express'
import { OrderController } from '../controllers/orders.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createOrderRouter = ({ orderModel }) => {
  const orderRouter = new Router()
  const orderController = new OrderController({ orderModel })

  orderRouter.get('/', [validateSession, isAdmin], orderController.getAll)
  orderRouter.post('/', validateSession, orderController.create)

  orderRouter.get('/:id', validateSession, orderController.getById)
  orderRouter.delete('/:id', validateSession, orderController.delete)
  orderRouter.patch('/:id', validateSession, orderController.update)

  return orderRouter
}
