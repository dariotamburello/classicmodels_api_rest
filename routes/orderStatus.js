import { Router } from 'express'
import { OrderStatusController } from '../controllers/orderStatus.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createOrderStatusRouter = ({ orderStatusModel }) => {
  const orderStatusRouter = new Router()
  const orderStatusController = new OrderStatusController({ orderStatusModel })

  orderStatusRouter.get('/', [validateSession, isAdmin], orderStatusController.getAll)
  orderStatusRouter.post('/', [validateSession, isAdmin], orderStatusController.create)

  orderStatusRouter.get('/:id', [validateSession, isAdmin], orderStatusController.getById)
  orderStatusRouter.delete('/:id', [validateSession, isAdmin], orderStatusController.delete)
  orderStatusRouter.patch('/:id', [validateSession, isAdmin], orderStatusController.update)

  return orderStatusRouter
}
