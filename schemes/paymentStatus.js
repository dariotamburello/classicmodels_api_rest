import z from 'zod'

const paymentStatusScheme = z.object({
  title: z
    .string({
      invalid_type_error: 'Status title must be a string',
      required_error: 'Status title is required'
    }),
  description: z
    .string({
      invalid_type_error: 'Status description must be a string',
      required_error: 'Status description is required'
    })
})

export function validatePaymentStatus (object) {
  return paymentStatusScheme.safeParseAsync(object)
}

export function validatePartialPaymentStatus (object) {
  return paymentStatusScheme.partial().safeParseAsync(object)
}
