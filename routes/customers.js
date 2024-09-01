import { Router } from 'express'
import { CustomerController } from '../controllers/customers.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createCustomerRouter = ({ customerModel }) => {
  const customerRouter = new Router()
  const customerController = new CustomerController({ customerModel })

  customerRouter.get('/', validateSession, customerController.getAll)
  customerRouter.post('/', customerController.create)

  customerRouter.get('/:id', validateSession, customerController.getById)
  customerRouter.delete('/:id', [validateSession, isAdmin], customerController.delete)
  customerRouter.patch('/:id', validateSession, customerController.update)

  return customerRouter
}
