import z from 'zod'
import { CustomerModel } from '../models/customers.js'
import { OrderStatusModel } from '../models/orderStatus.js'
import { PaymentsModel } from '../models/payments.js'
import { OfficeModel } from '../models/offices.js'

const orderScheme = z.object({
  requiredDate: z.coerce
    .date({
      invalid_type_error: 'Required date field must be format date'
    }),
  pickUpDate: z.coerce
    .date({
      invalid_type_error: 'Pick up date field must be format date'
    })
    .optional(),
  status: z
    .string({
      invalid_type_error: 'Status must be a string',
      required_error: 'Status is required'
    })
    .refine(async (e) => {
      return await checkIfStatusIsValid(e)
    }, 'Select a valid status'),
  comments: z
    .string({ invalid_type_error: 'Comments must be a string' })
    .optional(),
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
  total: z
    .number({
      invalid_type_error: 'Total must be a number',
      required_error: 'Total is required'
    })
    .positive(),
  paymentCheckNumber: z
    .string({
      invalid_type_error: 'Payment check number must be a string'
    })
    .optional()
    .refine(async (e) => {
      if (e === undefined) return true
      return await checkIfPaymentCheckNumberIsValid(e)
    }, 'Select a valid payment check number'),
  pickUpOffice: z
    .string({
      invalid_type_error: 'Pick up office be a string',
      required_error: 'Pick up office is required'
    })
    .refine(async (e) => {
      return await checkIfPickUpOfficeIsValid(e)
    }, 'Select a valid pick up office'),
  orderDetails: z
    .array(z.object({
      productCode: z.string(),
      quantityOrdered: z.number(),
      priceEach: z.number(),
      orderLineNumber: z.number()
    }))
    .optional()
})

export function validateOrder (object) {
  return orderScheme.safeParseAsync(object)
}

export function validatePartialOrder (object) {
  return orderScheme.partial().safeParseAsync(object)
}

async function checkIfStatusIsValid (id) {
  const valid = await OrderStatusModel.getById({ id })
  return valid.length > 0
}

async function checkIfCustomerNumberIsValid (number) {
  const valid = await CustomerModel.getById({ id: number })
  return valid.length > 0
}

async function checkIfPaymentCheckNumberIsValid (code) {
  const valid = await PaymentsModel.getById({ id: code })
  return valid.length > 0
}

async function checkIfPickUpOfficeIsValid (id) {
  const valid = await OfficeModel.getById({ id })
  return valid.length > 0
}
