import { Router } from 'express'
import { UsersController } from '../controllers/users.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createUsersRouter = ({ usersModel }) => {
  const usersRouter = new Router()
  const usersController = new UsersController({ usersModel })

  usersRouter.get('/', [validateSession, isAdmin], usersController.getAll)
  usersRouter.post('/', [validateSession, isAdmin], usersController.create)

  usersRouter.get('/:id', [validateSession, isAdmin], usersController.getById)
  usersRouter.delete('/:id', [validateSession, isAdmin], usersController.delete)
  usersRouter.patch('/:id', [validateSession, isAdmin], usersController.update)

  return usersRouter
}
