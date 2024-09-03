import z from 'zod'
import { UsersModel } from '../models/users.js'
import { userActive } from '../constants/userActive.js'
import { userGroups } from '../constants/userGroups.js'

const authenticationScheme = z.object({
  username: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'User name is required'
  })
    .refine(async (e) => {
      return await checkIfUsernameExist(e)
    }, 'Username is already in use'),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password name is required'
  })
    .refine(e => {
      return e.length > 6
    }, 'Password must have 7 or more chararters'),
  lastLogin: z
    .string({
      invalid_type_error: 'Last login must be a datetime.'
    }).transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), 'Last login must be a valid datetime.')
    .optional(),
  active: z
    .enum([userActive.ACTIVE, userActive.DISABLED], {
      errorMap: (issue, ctx) => ({ message: 'Please select an option.' })
    })
    .optional(),
  usergroup: z
    .enum([userGroups.USER, userGroups.MODERATOR, userGroups.ADMIN], {
      errorMap: (issue, ctx) => ({ message: 'Please select an option.' })
    })
    .optional()
})

export function validateUser (object) {
  return authenticationScheme.safeParseAsync(object)
}

export function validatePartialUser (object) {
  return authenticationScheme.partial().safeParseAsync(object)
}

async function checkIfUsernameExist (username) {
  const valid = await UsersModel.getByUsername(username)
  return !valid
}
