import { validatePaymentMethod, validatePartialPaymentMethod } from '../schemes/paymentMethods.js'

export class PaymentMethodsController {
  constructor ({ paymentMethodsModel }) {
    this.paymentMethodsModel = paymentMethodsModel
  }

  getAll = async (req, res) => {
    const paymentMethods = await this.paymentMethodsModel.getAll()
    res.json(paymentMethods)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const paymentMethod = await this.paymentMethodsModel.getById({ id })
    if (!paymentMethod) return res.status(404).json({ error: 'Payment method not found' })

    res.json(paymentMethod)
  }

  create = async (req, res) => {
    const result = validatePaymentMethod(req.body)
    if (result.error) return res.status(401).json({ error: JSON.parse(result.error.message)[0].message })

    const paymentMethod = await this.paymentMethodsModel.create(result.data)
    if (!paymentMethod) return res.status(401).json({ error: 'Can\'t create payment method' })

    res.json(paymentMethod)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const paymentMethod = await this.paymentMethodsModel.delete(id)
    if (!paymentMethod) return res.status(404).json({ error: 'Payment method not found' })

    return res.json({ message: 'Payment method deleted ' })
  }

  update = async (req, res) => {
    const { id } = req.params

    const validation = validatePartialPaymentMethod(req.body)
    if (validation.error) return res.status(400).json({ error: JSON.parse(validation.error.message)[0].message })

    const result = await this.paymentMethodsModel.update(id, validation.data)
    if (!result) return res.status(404).json({ error: 'Payment method not found' })

    res.status(202).json(result)
  }
}
