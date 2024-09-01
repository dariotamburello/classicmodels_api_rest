import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middleware/cors.js'
import expressEjsLayouts from 'express-ejs-layouts'

import { createProductRouter } from './routes/products.js'
import { ProductModel } from './models/products.js'
import { createProductLineRouter } from './routes/productLines.js'
import { ProductLineModel } from './models/productLines.js'
import { createCustomerRouter } from './routes/customers.js'
import { CustomerModel } from './models/customers.js'
import { createOfficeRouter } from './routes/offices.js'
import { OfficeModel } from './models/offices.js'
import { createEmployeeRouter } from './routes/employees.js'
import { EmployeeModel } from './models/employees.js'
import { createOrderRouter } from './routes/orders.js'
import { OrderModel } from './models/orders.js'
import { createOrderStatusRouter } from './routes/orderStatus.js'
import { OrderStatusModel } from './models/orderStatus.js'
import { createOrderDetailsRouter } from './routes/orderDetails.js'
import { OrderDetailsModel } from './models/orderDetails.js'
import { createPaymentMethodsRouter } from './routes/paymentMethods.js'
import { PaymentMethodsModel } from './models/paymentMethods.js'
import { createPaymentsRouter } from './routes/payments.js'
import { PaymentsModel } from './models/payments.js'
import { createAuthenticationRouter } from './routes/authentication.js'
import { UsersModel } from './models/users.js'
import { createUsersRouter } from './routes/users.js'
import { PaymentStatusModel } from './models/paymentStatus.js'
import { createPaymentStatusRouter } from './routes/paymentStatus.js'

import { createDashboardRouter } from './routes/dashboard.js'
import { DashboardController } from './controllers/dashboard.js'

import { errorHandler } from './middleware/errorHandler.js'
import { checkToken } from './middleware/auth.js'

// process.loadEnvFile()

const port = process.env.APPPORT ?? 3000

const app = express()
app.use(json())
app.use(cookieParser())
app.use(corsMiddleware())

app.disable('x-powered-by')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

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

app.use('/products', createProductRouter({ productModel: ProductModel }))
app.use('/productLines', createProductLineRouter({ productLineModel: ProductLineModel }))
app.use('/customers', createCustomerRouter({ customerModel: CustomerModel }))
app.use('/offices', createOfficeRouter({ officeModel: OfficeModel }))
app.use('/employees', createEmployeeRouter({ employeeModel: EmployeeModel }))
app.use('/orders', createOrderRouter({ orderModel: OrderModel }))
app.use('/orderstatus', createOrderStatusRouter({ orderStatusModel: OrderStatusModel }))
app.use('/orderDetails', createOrderDetailsRouter({ orderDetailsModel: OrderDetailsModel }))
app.use('/paymentMethods', createPaymentMethodsRouter({ paymentMethodsModel: PaymentMethodsModel }))
app.use('/payments', createPaymentsRouter({ paymentsModel: PaymentsModel }))
app.use('/paymentstatus', createPaymentStatusRouter({ paymentStatusModel: PaymentStatusModel }))
app.use('/users', createUsersRouter({ usersModel: UsersModel }))
app.use('/auth', createAuthenticationRouter({ usersModel: UsersModel }))
app.use('/dashboard', createDashboardRouter())

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
