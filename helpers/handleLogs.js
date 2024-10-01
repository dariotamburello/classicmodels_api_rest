import crypto from 'node:crypto'
import { getFormattedDateTime } from './datetimes.js'
import { defaultDataModel } from '../server-data-model.js'

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
    defaultDataModel.LogsModel.create(log)
  }
}

export const handleTimeErrors = (action, time) => {
  if (process.env.ENV !== 'PRD') {
    console.log(time)
  }
}
