import { userActive } from '../constants/userActive.js'
import { userGroups } from '../constants/userGroups.js'

if (process.env.ENV !== 'PRD') process.loadEnvFile()

export const globalSettings = {
  ENVIRONMENT: process.env.ENVIRONMENT ?? 'testing',
  IS_PRODUCTION: process.env.ENVIRONMENT === 'production',
  UTC_HOURS: +1,
  ACTIVE_USERS_AT_REGISTER: userActive.DISABLED,
  DEFAULT_GROUP_NEW_USER: userGroups.USER
}
