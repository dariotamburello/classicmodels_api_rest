import { Router } from 'express'
import { PaymentMethodsController } from '../controllers/paymentMethods.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createPaymentMethodsRouter = ({ paymentMethodsModel }) => {
  const paymentMethodsRouter = new Router()
  const paymentMethodsController = new PaymentMethodsController({ paymentMethodsModel })

  paymentMethodsRouter.get('/', [validateSession, isAdmin], paymentMethodsController.getAll)
  paymentMethodsRouter.post('/', [validateSession, isAdmin], paymentMethodsController.create)

  paymentMethodsRouter.get('/:id', [validateSession, isAdmin], paymentMethodsController.getById)
  paymentMethodsRouter.delete('/:id', [validateSession, isAdmin], paymentMethodsController.delete)
  paymentMethodsRouter.patch('/:id', [validateSession, isAdmin], paymentMethodsController.update)

  return paymentMethodsRouter
}
