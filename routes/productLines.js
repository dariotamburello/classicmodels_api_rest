import { Router } from 'express'
import { ProductLineController } from '../controllers/productLines.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createProductLineRouter = ({ productLineModel }) => {
  const productLineRouter = new Router()
  const productLineController = new ProductLineController({ productLineModel })

  productLineRouter.get('/', productLineController.getAll)
  productLineRouter.post('/', [validateSession, isAdmin], productLineController.create)

  productLineRouter.get('/:id', productLineController.getById)
  productLineRouter.delete('/:id', [validateSession, isAdmin], productLineController.delete)
  productLineRouter.patch('/:id', [validateSession, isAdmin], productLineController.update)

  return productLineRouter
}
