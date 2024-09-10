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
    .optional(),
  imageurl: z
    .string({
      invalid_type_error: 'Image url must be a valid URL.'
    }).url({
      message: 'Image url must be a valid URL.'
    })
    .optional(),
  identifier: z
    .string({
      invalid_type_error: 'Identifier must be a string'
    })
    .optional()
})

export function validateProductLines (object) {
  return productLinesScheme.safeParse(object)
}

export function validatePartialProductLines (object) {
  return productLinesScheme.partial().safeParse(object)
}
