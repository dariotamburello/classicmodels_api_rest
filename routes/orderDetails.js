import { Router } from 'express'
import { OrderDetailsController } from '../controllers/orderDetails.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createOrderDetailsRouter = ({ orderDetailsModel }) => {
  const orderDetailRouter = new Router()
  const orderDetailController = new OrderDetailsController({ orderDetailsModel })

  orderDetailRouter.get('/', validateSession, orderDetailController.getAll)
  orderDetailRouter.post('/', validateSession, orderDetailController.create)

  orderDetailRouter.get('/:id', validateSession, orderDetailController.getById)
  orderDetailRouter.delete('/:id', [validateSession, isAdmin], orderDetailController.delete)
  orderDetailRouter.patch('/:id', [validateSession, isAdmin], orderDetailController.update)

  return orderDetailRouter
}
