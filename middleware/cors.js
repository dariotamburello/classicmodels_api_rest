import cors from 'cors'

const ACCEPTED_ORIGINS = [
  '*',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.100.52:5173',
  'http://localhost:9900',
  'http://76.76.21.164:443',
  'https://76.76.21.164:443',
  'https://classicmodels-api-rest.vercel.app'
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
