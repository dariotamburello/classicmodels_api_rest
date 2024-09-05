import crypto from 'node:crypto'
import { LogsModel } from '../models/logs.js'
import { getFormattedDateTime } from './datetimes.js'

if (process.env.ENV !== 'PRD') process.loadEnvFile()

export const handleErrorLog = (error, route, headers) => {
  if (process.env.ENV !== 'PRD') {
    console.log(error, route)
  } else {
    const log = {
      id: crypto.randomUUID(),
      datetime: getFormattedDateTime(),
      type: error.errorType,
      description: error.description,
      originurl: route,
      originheader: headers.toString()
    }
    LogsModel.create(log)
  }
}

export const handleTimeErrors = (action, time) => {
  if (process.env.ENV !== 'PRD') {
    console.log(time)
  }
}
