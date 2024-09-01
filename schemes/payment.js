import z from 'zod'
import { CustomerModel } from '../models/customers.js'
import { PaymentMethodsModel } from '../models/paymentMethods.js'
import { PaymentStatusModel } from '../models/paymentStatus.js'

const paymentScheme = z.object({
  customerNumber: z
    .number({
      invalid_type_error: 'Customer number must be a number',
      required_error: 'Customer number is required'
    })
    .int()
    .positive()
    .refine(async (e) => {
      return await checkIfCustomerNumberIsValid(e)
    }, 'Select a valid customer number'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive(),
  paymentStatus: z
    .string({
      invalid_type_error: 'Payment status must be a string',
      required_error: 'Payment status is required'
    })
    .refine(async (e) => {
      return await checkIfPaymentStatusIsValid(e)
    }, 'Select a valid payment status'),
  paymentMethod: z
    .string({
      invalid_type_error: 'Payment method must be a string',
      required_error: 'Payment method is required'
    })
    .refine(async (e) => {
      return await checkIfPaymentMethodIsValid(e)
    }, 'Select a valid payment method')
})

export function validatePayment (object) {
  return paymentScheme.safeParseAsync(object)
}

export function validatePartialPayment (object) {
  return paymentScheme.partial().safeParseAsync(object)
}

async function checkIfCustomerNumberIsValid (number) {
  const valid = await CustomerModel.getById({ id: number })
  return valid.length > 0
}

async function checkIfPaymentStatusIsValid (id) {
  const valid = await PaymentStatusModel.getById({ id })
  return valid.length > 0
}

async function checkIfPaymentMethodIsValid (id) {
  const valid = await PaymentMethodsModel.getById({ id })
  return valid.length > 0
}
