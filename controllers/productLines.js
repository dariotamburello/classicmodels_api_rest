// import { updateProductLines } from '../schemes/product.js'
import crypto from 'node:crypto'
import { validatePartialProductLines, validateProductLines } from '../schemes/productlines.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class ProductLineController {
  constructor ({ productLineModel }) {
    this.productLineModel = productLineModel
  }

  getAll = async (req, res, next) => {
    try {
      const productLines = await this.productLineModel.getAll()
      res.json(productLines)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const productLine = await this.productLineModel.getById({ id })
      // if (!productLine) res.status(404).json({ message: 'Product line not found' })
      res.json(productLine)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = validateProductLines(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      resultValidation.data.id = crypto.randomUUID()
      const productLine = await this.productLineModel.create(resultValidation.data)
      if (!productLine) throw new DataError('Can\'t create products line.')
      // updateProductLines()
      res.status(201).json(productLine)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.productLineModel.delete(id)
      if (!result) throw new DataError(`Products line '${id}' not found.`)
      return res.json({ message: 'Products line deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = validatePartialProductLines(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.productLineModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Products line '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
