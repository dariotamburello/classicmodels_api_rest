import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:9900',
  'http://192.168.100.52:3000',
  'https://classicmodels-api-rest.vercel.app/'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // TODO error handler
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
