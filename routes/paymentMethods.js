import { Router } from 'express'
import { PaymentMethodsController } from '../controllers/paymentMethods.js'

export const createPaymentMethodsRouter = ({ paymentMethodsModel }) => {
  const paymentMethodsRouter = new Router()
  const paymentMethodsController = new PaymentMethodsController({ paymentMethodsModel })

  paymentMethodsRouter.get('/', paymentMethodsController.getAll)
  paymentMethodsRouter.post('/', paymentMethodsController.create)

  paymentMethodsRouter.get('/:id', paymentMethodsController.getById)
  paymentMethodsRouter.delete('/:id', paymentMethodsController.delete)
  paymentMethodsRouter.patch('/:id', paymentMethodsController.update)

  return paymentMethodsRouter
}
