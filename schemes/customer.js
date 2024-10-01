import z from 'zod'
import { defaultDataModel } from '../server-data-model.js'

const customerScheme = z.object({
  customerName: z.string({
    invalid_type_error: 'Customer name must be a string',
    required_error: 'Customer name is required'
  }),
  contactLastName: z.string({
    invalid_type_error: 'Contact last name must be a string',
    required_error: 'Contact last name is required'
  }),
  contactFirstName: z.string({
    invalid_type_error: 'Contact first name must be a string',
    required_error: 'Contact first name is required'
  }),
  phone: z.string({
    invalid_type_error: 'Phone must be a string',
    required_error: 'Phone is required'
  }),
  addressLine1: z
    .string({
      invalid_type_error: 'Address must be a string',
      required_error: 'Address is required'
    }),
  addressLine2: z
    .string({
      invalid_type_error: 'Address must be a string'
    })
    .optional(),
  city: z
    .string({
      invalid_type_error: 'City must be a string',
      required_error: 'City is required'
    }),
  state: z
    .string({
      invalid_type_error: 'State must be a string'
    })
    .optional(),
  postalCode: z
    .string({
      invalid_type_error: 'Postal code must be a string'
    })
    .optional(),
  country: z.string({
    invalid_type_error: 'Country must be a string',
    required_error: 'Country is required'
  }),
  salesRepEmployeeNumber: z
    .number()
    .int()
    .positive()
    .refine(async (e) => {
      return await checkIfSalesRepEmployeeNumberIsValid(e)
    }, 'Select a valid customer number'),
  creditLimit: z.number().min(0)
})

export function validateCustomer (object) {
  return customerScheme.safeParseAsync(object)
}

export function validatePartialCustomer (object) {
  return customerScheme.partial().safeParseAsync(object)
}

async function checkIfSalesRepEmployeeNumberIsValid (number) {
  const valid = await defaultDataModel.EmployeeModel.getById({ id: number })
  return valid.length > 0
}
