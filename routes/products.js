import { Router } from 'express'
import { ProductController } from '../controllers/products.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createProductRouter = ({ productModel }) => {
  const productRouter = new Router()
  const productController = new ProductController({ productModel })

  productRouter.get('/', productController.getAll)
  productRouter.post('/', [validateSession, isAdmin], productController.create)

  productRouter.get('/:id', productController.getById)
  productRouter.delete('/:id', [validateSession, isAdmin], productController.delete)
  productRouter.patch('/:id', validateSession, productController.update)

  return productRouter
}
