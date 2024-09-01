import { Router } from 'express'
import { PaymentsController } from '../controllers/payments.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createPaymentsRouter = ({ paymentsModel }) => {
  const paymentsRouter = new Router()
  const paymentsController = new PaymentsController({ paymentsModel })

  paymentsRouter.get('/', [validateSession, isAdmin], paymentsController.getAll)
  paymentsRouter.post('/', [validateSession, isAdmin], paymentsController.create)

  paymentsRouter.get('/:id', [validateSession, isAdmin], paymentsController.getById)
  paymentsRouter.delete('/:id', [validateSession, isAdmin], paymentsController.delete)
  paymentsRouter.patch('/:id', [validateSession, isAdmin], paymentsController.update)

  return paymentsRouter
}
