import z from 'zod'
import { EmployeeModel } from '../models/employees.js'
import { OfficeModel } from '../models/offices.js'

const employeeScheme = z.object({
  lastName: z.string({
    invalid_type_error: 'Last name must be a string',
    required_error: 'Last name is required'
  }),
  firstName: z.string({
    invalid_type_error: 'First name must be a string',
    required_error: 'First name is required'
  }),
  extension: z.string({
    invalid_type_error: 'Extension must be a string',
    required_error: 'Extension is required'
  }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required'
    })
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.')
    .refine(async (e) => {
      return await checkIfEmailIsValid(e)
    }, 'This email is already in use'),
  officeCode: z
    .number({ invalid_type_error: 'Office Code must be a number' })
    .int()
    .positive()
    .optional()
    .refine(async (e) => {
      if (e === undefined) return true
      return await checkIfOfficeCodeIsValid(e)
    }, 'Select a valid office code'),
  reportsTo: z
    .number()
    .int()
    .positive()
    .optional()
    .refine(async (e) => {
      if (e === undefined) return true
      return await checkIfEmployeeIsValid(e)
    }, 'Select a valid employee'),
  jobTitle: z.string({
    invalid_type_error: 'Job title must be a string',
    required_error: 'Job title is required'
  })
})

export function validateEmployee (object) {
  return employeeScheme.safeParseAsync(object)
}

export function validatePartialEmployee (object) {
  return employeeScheme.partial().safeParseAsync(object)
}

async function checkIfEmailIsValid (email) {
  const valid = await EmployeeModel.getByEmail(email)
  return valid.length === 0
}

async function checkIfOfficeCodeIsValid (officeCode) {
  const valid = await OfficeModel.getById({ id: officeCode })
  return valid.length > 0
}

async function checkIfEmployeeIsValid (employeeNumber) {
  const valid = await EmployeeModel.getById({ id: employeeNumber })
  return valid.length > 0
}
