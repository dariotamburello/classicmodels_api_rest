import z from 'zod'

const paymentMethodScheme = z.object({
  type: z.string({
    invalid_type_error: 'Type must be a string',
    required_error: 'Type is required'
  }),
  enabled: z.string({
    invalid_type_error: 'Enabled must be a string',
    required_error: 'Enabled is required'
  })
})

export function validatePaymentMethod (object) {
  return paymentMethodScheme.safeParse(object)
}

export function validatePartialPaymentMethod (object) {
  return paymentMethodScheme.partial().safeParse(object)
}
