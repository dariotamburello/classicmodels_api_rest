import z from 'zod'

const officeScheme = z.object({
  city: z.string({
    invalid_type_error: 'City must be a string',
    required_error: 'City is required'
  }),
  phone: z.number({
    invalid_type_error: 'Phone must be a number',
    required_error: 'Phone is required'
  }),
  addressLine1: z.string({
    invalid_type_error: 'Address must be a string',
    required_error: 'Address is required'
  }),
  state: z
    .string({ invalid_type_error: 'State must be a string' })
    .optional(),
  postalCode: z
    .string({
      invalid_type_error: 'Postal code must be a string',
      required_error: 'Postal code is required'
    }),
  country: z.string({
    invalid_type_error: 'Country must be a string',
    required_error: 'Country is required'
  }),
  territory: z.string({
    invalid_type_error: 'Territory must be a string',
    required_error: 'Territory is required'
  })
})

export function validateOffice (object) {
  return officeScheme.safeParse(object)
}

export function validatePartialOffice (object) {
  return officeScheme.partial().safeParse(object)
}
