import { Router } from 'express'
import { AuthenticationController } from '../controllers/authentication.js'

export const createAuthenticationRouter = ({ usersModel }) => {
  const authenticationRouter = new Router()
  const authenticationController = new AuthenticationController({ usersModel })

  authenticationRouter.post('/login', authenticationController.login)
  authenticationRouter.post('/register', authenticationController.register)
  authenticationRouter.post('/logout', authenticationController.logout)

  return authenticationRouter
}
