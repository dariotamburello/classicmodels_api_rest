import crypto from 'node:crypto'
import { validatePartialProducts, validateProducts } from '../schemes/product.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class ProductController {
  constructor ({ productModel }) {
    this.productModel = productModel
  }

  getAll = async (req, res, next) => {
    const { productLine } = req.query
    try {
      const products = await this.productModel.getAll({ productLine })
      // if (products.length === 0) throw new DataError('Products not found.')
      res.json(products)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const product = await this.productModel.getById({ id })
      // if (product.length === 0) throw new DataError(`Product code '${id}' not found.`)
      res.json(product)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = await validateProducts(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      resultValidation.data.id = crypto.randomUUID()
      const product = await this.productModel.create(resultValidation.data)
      if (!product) throw new DataError('Can\'t create product.')
      res.json(product)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.productModel.delete(id)
      if (!result) throw new DataError(`Product code '${id}' not found.`)
      return res.json({ message: 'Product deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = await validatePartialProducts(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message))
      const result = await this.productModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Product code '${id}' not found.`)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  }
}
