import z from 'zod'
import { defaultDataModel } from '../server-data-model.js'

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
  productId: z
    .string({ invalid_type_error: 'Product id must be a string' })
    .refine(async (e) => {
      return await checkIfProductIdIsValid(e)
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
  const valid = await defaultDataModel.OrderModel.getById({ id })
  return valid.length > 0
}

async function checkIfProductIdIsValid (id) {
  if (thisOrderProducts.includes(id)) {
    console.log('duplicated in the same query')
    return false
  }
  thisOrderProducts.push(id)

  const productsInOrder = await defaultDataModel.OrderDetailsModel.getAll({ orderNumber: thisOrderNumber })
  for (const p of productsInOrder) {
    if (p.productCode === id) {
      console.log('duplicated in the same order')
      return false
    }
  }

  const valid = await defaultDataModel.ProductModel.getById({ id })
  if (valid.length === 0) {
    console.log("the product code don't exist")
    return false
  }

  return true
}

async function checkIfOrderLineNumberExist (id) {
  const valid = await defaultDataModel.OrderDetailsModel.getById({ orderNumber: thisOrderNumber, orderLineNumber: id })
  return valid.length === 0
}

export function refreshScheme () {
  thisOrderProducts = []
}
