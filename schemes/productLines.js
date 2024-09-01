import z from 'zod'

const productLinesScheme = z.object({
  title: z
    .string({
      invalid_type_error: 'Product Line name must be a string',
      required_error: 'Product Line name is required'
    }),
  description: z
    .string({
      invalid_type_error: 'Text description must be a string'
    })
    .optional()
})

export function validateProductLines (object) {
  return productLinesScheme.safeParse(object)
}

export function validatePartialProductLines (object) {
  return productLinesScheme.partial().safeParse(object)
}
