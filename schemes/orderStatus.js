import z from 'zod'

const orderStatusScheme = z.object({
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
      required_error: 'Title is required'
    }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string'
    })
    .optional()
})

export function validateOrderStatus (object) {
  return orderStatusScheme.safeParse(object)
}

export function validatePartialOrderStatus (object) {
  return orderStatusScheme.partial().safeParse(object)
}
