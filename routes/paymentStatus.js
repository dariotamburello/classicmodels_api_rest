import { Router } from 'express'
import { PaymentStatusController } from '../controllers/paymentStatus.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createPaymentStatusRouter = ({ paymentStatusModel }) => {
  const paymentStatusRouter = new Router()
  const paymentStatusController = new PaymentStatusController({ paymentStatusModel })

  paymentStatusRouter.get('/', [validateSession, isAdmin], paymentStatusController.getAll)
  paymentStatusRouter.post('/', [validateSession, isAdmin], paymentStatusController.create)

  paymentStatusRouter.get('/:id', [validateSession, isAdmin], paymentStatusController.getById)
  paymentStatusRouter.delete('/:id', [validateSession, isAdmin], paymentStatusController.delete)
  paymentStatusRouter.patch('/:id', [validateSession, isAdmin], paymentStatusController.update)

  return paymentStatusRouter
}
