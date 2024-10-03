import { Router } from 'express'
import { checkToken } from '../middleware/auth.js'

export const createDashboardRouter = (dashboardController) => {
  const dashboardRouter = new Router()

  dashboardRouter.get('/', checkToken, dashboardController.dashboard)
  dashboardRouter.get('/products', checkToken, dashboardController.productsView)
  dashboardRouter.get('/orders', checkToken, dashboardController.orderlistView)
  dashboardRouter.get('/payments', checkToken, dashboardController.paymentsView)
  dashboardRouter.get('/customers', checkToken, dashboardController.customersView)
  dashboardRouter.get('/favorites', checkToken, dashboardController.dashboard)
  dashboardRouter.get('/settings', checkToken, dashboardController.settingsView)
  dashboardRouter.get('/offices', checkToken, dashboardController.officesView)
  dashboardRouter.get('/paymentmethods', checkToken, dashboardController.paymentMethodsView)
  dashboardRouter.get('/paymentstatus', checkToken, dashboardController.paymentStatusView)
  dashboardRouter.get('/orderstatus', checkToken, dashboardController.orderStatusView)
  dashboardRouter.get('/productlines', checkToken, dashboardController.productLinesView)
  dashboardRouter.get('/users', checkToken, dashboardController.usersView)
  dashboardRouter.get('/logs', checkToken, dashboardController.logsView)
  dashboardRouter.get('/maintenance', checkToken, dashboardController.maintenance)

  dashboardRouter.get('/download', checkToken, dashboardController.generatePdf)

  return dashboardRouter
}
