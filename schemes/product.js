import z from 'zod'
import { ProductModel } from '../models/products.js'
import { ProductLineModel } from '../models/productLines.js'

const productScheme = z.object({
  productCode: z
    .string({
      invalid_type_error: 'Product code must be a string',
      required_error: 'Product code is required'
    })
    .refine(async (e) => {
      return await checkIfProductCodeExist(e)
    }, 'Product code is already in use'),
  productName: z
    .string({
      invalid_type_error: 'Product name must be a string.',
      required_error: 'Product name is required'
    }),
  productLine: z
    .string({
      invalid_type_error: 'Product line must be a string.',
      required_error: 'Product line is required.'
    })
    .refine(async (e) => {
      return await checkIfProductLineExist(e)
    }, 'Select a valid product line.'),
  productScale: z
    .string({
      invalid_type_error: 'Product scale must be a string.',
      required_error: 'Product scale is required.'
    }),
  productVendor: z
    .string({
      invalid_type_error: 'Product vendor must be a string.',
      required_error: 'Product vendor is required.'
    }),
  productDescription: z
    .string({
      invalid_type_error: 'Product description must be a string.',
      required_error: 'Product description is required.'
    }),
  quantityInStock: z
    .number({
      invalid_type_error: 'Quantity in stock must be a number.',
      required_error: 'Quantity in stock is required.'
    })
    .int()
    .positive(),
  buyPrice: z
    .number({
      invalid_type_error: 'Buy price must be a number.',
      required_error: 'Buy price is required.'
    })
    .min(0),
  MSRP: z
    .number({
      invalid_type_error: 'MSRP must be a number.',
      required_error: 'MSRP is required.'
    })
    .min(0),
  productImage: z
    .string({
      invalid_type_error: 'Product image must be a valid URL.',
      required_error: 'Product image is required'
    }).url({
      message: 'Product image must be a valid URL.'
    })
})

export function validateProducts (object) {
  return productScheme.safeParseAsync(object)
}

export function validatePartialProducts (object) {
  return productScheme.partial().safeParseAsync(object)
}

async function checkIfProductCodeExist (code) {
  const valid = await ProductModel.getById({ id: code })
  return valid.length === 0
}

async function checkIfProductLineExist (code) {
  const valid = await ProductLineModel.getById({ id: code })
  return valid.length > 0
}
