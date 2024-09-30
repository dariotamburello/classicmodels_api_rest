import { validateCustomer, validatePartialCustomer } from '../schemes/customer.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class CustomerController {
  constructor ({ customerModel }) {
    this.customerModel = customerModel
  }

  getAll = async (req, res, next) => {
    const { salesRepEmployeeNumber } = req.query
    try {
      const customers = await this.customerModel.getAll({ salesRepEmployeeNumber })
      // if (customers.length === 0) throw new DataError('Customers not found.')
      res.json(customers)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const customer = await this.customerModel.getById({ id })
      // if (customer.length === 0) throw new DataError('Customer not found.')
      res.json(customer)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validateCustomer(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const previousCustomer = await this.customerModel.getLast()
      resultValidation.data.customerNumber = previousCustomer[0].customerNumber + 1
      const customer = await this.customerModel.create(resultValidation.data)
      if (!customer) throw new DataError('Can\'t create customer.')
      res.json(customer)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.customerModel.delete(id)
      if (!result) throw new DataError(`Customer id '${id}' not found.`)
      return res.json({ message: 'Customer deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialCustomer(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.customerModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Customer id '${id}' not found.`)
      res.status(202).json(result)
    } catch (error) {
      return next(error)
    }
  }
}
