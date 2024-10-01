import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middleware/cors.js'
import expressEjsLayouts from 'express-ejs-layouts'

import { defaultDataModel as dataModels } from './server-data-model.js'

import { createProductRouter } from './routes/products.js'
import { createProductLineRouter } from './routes/productLines.js'
import { createCustomerRouter } from './routes/customers.js'
import { createOfficeRouter } from './routes/offices.js'
import { createEmployeeRouter } from './routes/employees.js'
import { createOrderRouter } from './routes/orders.js'
import { createOrderStatusRouter } from './routes/orderStatus.js'
import { createOrderDetailsRouter } from './routes/orderDetails.js'
import { createPaymentMethodsRouter } from './routes/paymentMethods.js'
import { createPaymentsRouter } from './routes/payments.js'
import { createAuthenticationRouter } from './routes/authentication.js'
import { createUsersRouter } from './routes/users.js'
import { createPaymentStatusRouter } from './routes/paymentStatus.js'
import { createLogsRouter } from './routes/logs.js'

import { createDashboardRouter } from './routes/dashboard.js'
import { DashboardController } from './controllers/dashboard.js'

import { errorHandler } from './middleware/errorHandler.js'
import { checkToken } from './middleware/auth.js'

if (process.env.ENV !== 'PRD') process.loadEnvFile()
const port = process.env.APPPORT ?? 3000

const app = express()
app.use(json())
app.use(cookieParser())
app.use(corsMiddleware())

app.disable('x-powered-by')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/docs', express.static(path.join(__dirname, 'docs')))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(expressEjsLayouts)

const dashboardController = new DashboardController()

app.get('/', checkToken, (req, res) => {
  try {
    const user = req.session?.user
    if (user) dashboardController.dashboard(req, res)
    else res.render('login', { layout: './layouts/empty' })
  } catch (error) {
    throw new Error(error)
  }
})

app.get('/login', checkToken, (req, res) => {
  try {
    const user = req.session?.user
    if (user) dashboardController.dashboard(req, res)
    else res.render('login', { layout: './layouts/empty' })
  } catch (error) {
    throw new Error(error)
  }
})

app.use('/products', createProductRouter({ productModel: dataModels.ProductModel }))
app.use('/productLines', createProductLineRouter({ productLineModel: dataModels.ProductLineModel }))
app.use('/customers', createCustomerRouter({ customerModel: dataModels.CustomerModel }))
app.use('/offices', createOfficeRouter({ officeModel: dataModels.OfficeModel }))
app.use('/employees', createEmployeeRouter({ employeeModel: dataModels.EmployeeModel }))
app.use('/orders', createOrderRouter({ orderModel: dataModels.OrderModel }))
app.use('/orderstatus', createOrderStatusRouter({ orderStatusModel: dataModels.OrderStatusModel }))
app.use('/orderDetails', createOrderDetailsRouter({ orderDetailsModel: dataModels.OrderDetailsModel }))
app.use('/paymentMethods', createPaymentMethodsRouter({ paymentMethodsModel: dataModels.PaymentMethodsModel }))
app.use('/payments', createPaymentsRouter({ paymentsModel: dataModels.PaymentsModel }))
app.use('/paymentstatus', createPaymentStatusRouter({ paymentStatusModel: dataModels.PaymentStatusModel }))
app.use('/users', createUsersRouter({ usersModel: dataModels.UsersModel }))
app.use('/auth', createAuthenticationRouter({ usersModel: dataModels.UsersModel }))
app.use('/logs', createLogsRouter({ logsModel: dataModels.LogsModel }))
app.use('/dashboard', createDashboardRouter())

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
