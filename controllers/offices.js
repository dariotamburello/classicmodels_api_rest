import { validateOffice, validatePartialOffice } from '../schemes/office.js'
import { DataError, ValidationError } from '../utils/errorTypes.js'

export class OfficeController {
  constructor ({ officeModel }) {
    this.officeModel = officeModel
  }

  getAll = async (req, res, next) => {
    try {
      const offices = await this.officeModel.getAll()
      // if (offices.length === 0) throw new DataError('Offices not found.')
      res.json(offices)
    } catch (error) {
      return next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    try {
      const office = await this.officeModel.getById({ id })
      // if (!office) throw new DataError(`Offices '${id}' not found.`)
      res.json(office)
    } catch (error) {
      return next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const resultValidation = validateOffice(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message)[0])
      const office = await this.officeModel.create(resultValidation.data)
      if (!office) throw new DataError('Can\'t create office.')
      res.json(office)
    } catch (error) {
      return next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const result = await this.officeModel.delete(id)
      if (!result) throw new DataError(`Office '${id}' not found.`)
      return res.json({ message: 'Office deleted.' })
    } catch (error) {
      return next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    try {
      const resultValidation = validatePartialOffice(req.body)
      if (resultValidation.error) throw new ValidationError(JSON.parse(resultValidation.error.message)[0])
      const result = await this.officeModel.update(id, resultValidation.data)
      if (!result) throw new DataError(`Office '${id}' not found.`)
      res.status(202).json(result)
    } catch (error) {
      return next(error)
    }
  }
}
