import { Router } from 'express'
import { OfficeController } from '../controllers/offices.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createOfficeRouter = ({ officeModel }) => {
  const officeRouter = new Router()
  const officeController = new OfficeController({ officeModel })

  officeRouter.get('/', officeController.getAll)
  officeRouter.post('/', [validateSession, isAdmin], officeController.create)

  officeRouter.get('/:id', officeController.getById)
  officeRouter.delete('/:id', [validateSession, isAdmin], officeController.delete)
  officeRouter.patch('/:id', [validateSession, isAdmin], officeController.update)

  return officeRouter
}
