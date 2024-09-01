import { validateEmployee, validatePartialEmployee } from '../schemes/employee.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class EmployeeController {
  constructor ({ employeeModel }) {
    this.employeeModel = employeeModel
  }

  getAll = async (req, res, next) => {
    const { officeCode } = req.query
    try {
      const employees = await this.employeeModel.getAll({ officeCode })
      // if (employees.length === 0) throw new DataError('Employees not found.')
      res.json(employees)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const employee = await this.employeeModel.getById({ id })
      // if (employee.length === 0) throw new DataError('Employee not found.')
      res.json(employee)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validateEmployee(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const employee = await this.employeeModel.create(resultValidation.data)
      if (!employee) throw new DataError('Can\'t create employee.')
      res.json(employee)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.employeeModel.delete(id)
      if (!result) throw new DataError(`Employee id '${id}' not found.`)
      return res.json({ message: 'Employee deleted' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialEmployee(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.employeeModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Employee id '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
