import z from 'zod'
import { OrderModel } from '../models/orders.js'
import { ProductModel } from '../models/products.js'
import { OrderDetailsModel } from '../models/orderDetails.js'

let thisOrderNumber = 0
let thisOrderProducts = []

const orderDetailScheme = z.object({
  orderNumber: z
    .number({ invalid_type_error: 'Order number must be a number' })
    .int()
    .positive()
    .refine(async (e) => {
      return await checkIfOrderIsValid(e)
    }, 'Select a valid order number'),
  productCode: z
    .string({ invalid_type_error: 'Product code must be a string' })
    .refine(async (e) => {
      return await checkIfProductCodeIsValid(e)
    }, 'Select a valid product code'),
  quantityOrdered: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int()
    .positive()
    .min(1),
  orderLineNumber: z
    .number({ invalid_type_error: 'Order line must be a number' })
    .positive()
    .min(1)
    .refine(async (e) => {
      return await checkIfOrderLineNumberExist(e)
    }, 'The order line number is already in use.')
})

export function validateOrderDetail (object) {
  return orderDetailScheme.safeParseAsync(object)
}

export function validatePartialOrderDetail (object) {
  return orderDetailScheme.partial().safeParseAsync(object)
}

async function checkIfOrderIsValid (id) {
  thisOrderNumber = id
  const valid = await OrderModel.getById({ id })
  return valid.length > 0
}

async function checkIfProductCodeIsValid (code) {
  if (thisOrderProducts.includes(code)) {
    console.log('duplicated in the same query')
    return false
  }
  thisOrderProducts.push(code)

  const productsInOrder = await OrderDetailsModel.getAll({ orderNumber: thisOrderNumber })
  for (const p of productsInOrder) {
    if (p.productCode === code) {
      console.log('duplicated in the same order')
      return false
    }
  }

  const valid = await ProductModel.getById({ id: code })
  if (valid.length === 0) {
    console.log("the product code don't exist")
    return false
  }

  return true
}

async function checkIfOrderLineNumberExist (id) {
  const valid = await OrderDetailsModel.getById({ orderNumber: thisOrderNumber, orderLineNumber: id })
  return valid.length === 0
}

export function refreshScheme () {
  thisOrderProducts = []
}
