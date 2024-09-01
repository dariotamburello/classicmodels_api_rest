import { Router } from 'express'
import { EmployeeController } from '../controllers/employees.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createEmployeeRouter = ({ employeeModel }) => {
  const employeesRouter = new Router()
  const employeesController = new EmployeeController({ employeeModel })

  employeesRouter.get('/', [validateSession, isAdmin], employeesController.getAll)
  employeesRouter.post('/', [validateSession, isAdmin], employeesController.create)

  employeesRouter.get('/:id', validateSession, employeesController.getById)
  employeesRouter.delete('/:id', [validateSession, isAdmin], employeesController.delete)
  employeesRouter.patch('/:id', validateSession, employeesController.update)

  return employeesRouter
}
