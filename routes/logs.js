import { Router } from 'express'
import { isAdmin, validateSession } from '../middleware/auth.js'
import { LogsController } from '../controllers/logs.js'

export const createLogsRouter = ({ logsModel }) => {
  const logsRouter = new Router()
  const logsController = new LogsController({ logsModel })

  logsRouter.get('/', [validateSession, isAdmin], logsController.getAll)
  logsRouter.post('/', [validateSession, isAdmin], logsController.create)

  logsRouter.get('/:id', [validateSession, isAdmin], logsController.getById)
  logsRouter.delete('/:id', [validateSession, isAdmin], logsController.delete)
  logsRouter.patch('/:id', [validateSession, isAdmin], logsController.update)

  return logsRouter
}
